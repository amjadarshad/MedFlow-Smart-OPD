import mongoose from "mongoose";

import DoctorProfile from "../models/DoctorProfile.js";
import Department from "../models/Department.js";

import {
  doctorProfileStatus,
} from "../constants/doctorConstants.js";

const createDoctorProfile = async (req, res) => {
  try {
    const {
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
    } = req.body;

    if (!department || !specialization || !qualification) {
      return res.status(400).json({
        message:
          "Department, specialization and qualification are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    const existingDepartment = await Department.findById(
      department
    );

    if (!existingDepartment) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    const existingProfile = await DoctorProfile.findOne({
      user: req.user.id,
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Doctor profile already exists",
      });
    }

    const doctorProfile = await DoctorProfile.create({
      user: req.user.id,
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
    });

    const populatedDoctorProfile =
      await DoctorProfile.findById(doctorProfile._id)
        .populate("user", "name email role")
        .populate(
          "department",
          "name description status"
        );

    return res.status(201).json({
      message: "Doctor profile created successfully",
      doctor: populatedDoctorProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create doctor profile",
      error: error.message,
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { department } = req.query;

    const filters = {
      status: doctorProfileStatus.active,
    };

    if (department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({
          message: "Invalid department ID",
        });
      }

      filters.department = department;
    }

    const doctors = await DoctorProfile.find(filters)
      .populate("user", "name email")
      .populate(
        "department",
        "name description status"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch doctors",
      error: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid doctor ID",
      });
    }

    const doctor = await DoctorProfile.findById(id)
      .populate("user", "name email")
      .populate(
        "department",
        "name description status"
      );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch doctor",
      error: error.message,
    });
  }
};

const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findOne({
      user: req.user.id,
    })
      .populate("user", "name email role")
      .populate(
        "department",
        "name description status"
      );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      doctor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch doctor profile",
      error: error.message,
    });
  }
};

const updateMyDoctorProfile = async (req, res) => {
  try {
    const {
      department,
      specialization,
      qualification,
      experience,
      consultationFee,
      bio,
    } = req.body;

    const doctorProfile = await DoctorProfile.findOne({
      user: req.user.id,
    });

    if (!doctorProfile) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    if (department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({
          message: "Invalid department ID",
        });
      }

      const existingDepartment =
        await Department.findById(department);

      if (!existingDepartment) {
        return res.status(404).json({
          message: "Department not found",
        });
      }

      doctorProfile.department = department;
    }

    if (specialization !== undefined) {
      doctorProfile.specialization = specialization;
    }

    if (qualification !== undefined) {
      doctorProfile.qualification = qualification;
    }

    if (experience !== undefined) {
      doctorProfile.experience = experience;
    }

    if (consultationFee !== undefined) {
      doctorProfile.consultationFee = consultationFee;
    }

    if (bio !== undefined) {
      doctorProfile.bio = bio;
    }

    await doctorProfile.save();

    const populatedDoctorProfile =
      await DoctorProfile.findById(doctorProfile._id)
        .populate("user", "name email role")
        .populate(
          "department",
          "name description status"
        );

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: populatedDoctorProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update doctor profile",
      error: error.message,
    });
  }
};

export {
  createDoctorProfile,
  getDoctors,
  getDoctorById,
  getMyDoctorProfile,
  updateMyDoctorProfile,
};