import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    drugName: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      default: "",
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
      index: true,
    },
    symptoms: {
      type: String,
      default: "",
      trim: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    advice: {
      type: String,
      default: "",
      trim: true,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    medicines: {
      type: [medicineSchema],
      validate: {
        validator: (medicines) => medicines.length > 0,
        message: "At least one medicine is required.",
      },
    },
  },
  { timestamps: true },
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
