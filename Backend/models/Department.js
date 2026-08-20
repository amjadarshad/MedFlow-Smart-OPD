import mongoose from "mongoose";
import { departmentStatuses } from "../constants/departmentConstants.js";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(departmentStatuses),
      default: departmentStatuses.active,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model(
  "Department",
  departmentSchema
);

export default Department;