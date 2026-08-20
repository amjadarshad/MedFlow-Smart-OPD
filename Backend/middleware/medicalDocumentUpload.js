import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const medicalDocumentDirectory = path.resolve(
  currentDirectory,
  "../uploads/medical-records",
);

fs.mkdirSync(medicalDocumentDirectory, { recursive: true });

const allowedMimeTypes = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: medicalDocumentDirectory,
  filename: (req, file, callback) => {
    const extension = allowedMimeTypes[file.mimetype];
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const medicalDocumentUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes[file.mimetype]) {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file"));
      return;
    }
    callback(null, true);
  },
}).single("file");

export function handleMedicalDocumentUpload(req, res, next) {
  medicalDocumentUpload(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Medical document must be 10 MB or smaller.",
      });
    }

    return res.status(400).json({
      message: "Upload a PDF, JPEG, PNG or WebP medical document.",
    });
  });
}
