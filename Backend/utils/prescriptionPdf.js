import PDFDocument from "pdfkit";

function formatDate(value) {
  if (!value) return "Not specified";
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addSection(document, label, value) {
  document
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#475569")
    .text(label.toUpperCase());
  document
    .moveDown(0.35)
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#0f172a")
    .text(value || "Not specified", { lineGap: 2 })
    .moveDown(0.9);
}

export function streamPrescriptionPdf(response, prescription) {
  const patientName = prescription.patient?.name || "Patient";
  const doctorName = prescription.doctor?.user?.name || "Doctor";
  const departmentName =
    prescription.appointment?.department?.name || "Not specified";
  const document = new PDFDocument({
    size: "A4",
    margin: 48,
    info: {
      Title: `MedFlow Prescription ${prescription._id}`,
      Author: doctorName,
      Subject: `Medical prescription for ${patientName}`,
    },
  });

  document.pipe(response);

  document.rect(0, 0, document.page.width, 94).fill("#2563eb");
  document
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("MedFlow", 48, 35);
  document
    .font("Helvetica")
    .fontSize(10)
    .text("Medical Prescription", 48, 64);

  document.y = 120;
  document
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(patientName);
  document
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#64748b")
    .text(prescription.patient?.email || "");
  document
    .fontSize(10)
    .text(`Issued: ${formatDate(prescription.createdAt)}`, 330, 120, {
      width: 215,
      align: "right",
    })
    .text(`Doctor: ${doctorName}`, 330, 137, { width: 215, align: "right" })
    .text(`Department: ${departmentName}`, 330, 154, {
      width: 215,
      align: "right",
    });

  document.moveTo(48, 190).lineTo(547, 190).strokeColor("#e2e8f0").stroke();
  document.y = 216;

  addSection(document, "Diagnosis", prescription.diagnosis);
  if (prescription.symptoms) {
    addSection(document, "Symptoms", prescription.symptoms);
  }

  document
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#475569")
    .text("MEDICINES")
    .moveDown(0.55);

  prescription.medicines.forEach((medicine, index) => {
    if (document.y > document.page.height - 105) {
      document.addPage();
    }
    const medicineDetails = [medicine.drugName, medicine.dosage, medicine.frequency]
      .filter(Boolean)
      .join(" - ");
    const boxTop = document.y;
    document
      .roundedRect(48, boxTop, 499, 32, 4)
      .fill("#f8fafc");
    document
      .fillColor("#0f172a")
      .font("Helvetica")
      .fontSize(10.5)
      .text(`${index + 1}. ${medicineDetails}`, 59, boxTop + 10, {
        width: 475,
      });
    document.y = boxTop + 42;
  });

  document.moveDown(0.6);
  if (prescription.advice) addSection(document, "Advice", prescription.advice);
  if (prescription.followUpDate) {
    addSection(document, "Follow-up Date", formatDate(prescription.followUpDate));
  }

  document
    .moveTo(48, document.y + 4)
    .lineTo(547, document.y + 4)
    .strokeColor("#e2e8f0")
    .stroke();
  document
    .moveDown(1)
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#94a3b8")
    .text(`Prescription ID: ${prescription._id}`);

  document.end();
}
