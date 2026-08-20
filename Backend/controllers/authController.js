import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import Department from "../models/Department.js";
import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import { doctorProfileStatus } from "../constants/doctorConstants.js";
import { departmentStatuses } from "../constants/departmentConstants.js";
import {
  doctorApprovalStatuses,
  publicRegistrationRoles,
  userRoles,
  userStatus,
} from "../constants/userConstants.js";

const jwtExpiresIn = "7d";
const minPasswordLength = 6;

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: jwtExpiresIn }
  );
}

export async function registerUser(req, res) {
  try {
    const {
      name,
      email,
      password,
      role = userRoles.patient,
      department,
      specialization,
      qualification,
      experience = 0,
      consultationFee = 0,
      bio = "",
    } = req.body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password
    ) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!publicRegistrationRoles.includes(role)) {
      return res.status(400).json({ message: "Only patient and doctor accounts can be created here." });
    }

    if (password.length < minPasswordLength) {
      return res.status(400).json({ message: `Password must be at least ${minPasswordLength} characters long.` });
    }

    let doctorProfileData = null;

    if (role === userRoles.doctor) {
      if (
        !department ||
        typeof specialization !== "string" ||
        !specialization.trim() ||
        typeof qualification !== "string" ||
        !qualification.trim()
      ) {
        return res.status(400).json({
          message: "Department, specialization, and qualification are required.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({ message: "Invalid department." });
      }

      const normalizedExperience = Number(experience);
      const normalizedConsultationFee = Number(consultationFee);

      if (!Number.isFinite(normalizedExperience) || normalizedExperience < 0) {
        return res.status(400).json({ message: "Experience must be zero or greater." });
      }

      if (!Number.isFinite(normalizedConsultationFee) || normalizedConsultationFee < 0) {
        return res.status(400).json({ message: "Consultation fee must be zero or greater." });
      }

      const existingDepartment = await Department.findOne({
        _id: department,
        status: departmentStatuses.active,
      }).select("_id");

      if (!existingDepartment) {
        return res.status(404).json({ message: "Active department not found." });
      }

      doctorProfileData = {
        department: existingDepartment._id,
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experience: normalizedExperience,
        consultationFee: normalizedConsultationFee,
        bio: typeof bio === "string" ? bio.trim() : "",
        status: doctorProfileStatus.inactive,
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const canRecoverDoctorRegistration =
        role === userRoles.doctor &&
        existingUser.role === userRoles.doctor &&
        existingUser.status === userStatus.pending &&
        await bcrypt.compare(password, existingUser.password) &&
        !await DoctorProfile.exists({ user: existingUser._id });

      if (canRecoverDoctorRegistration) {
        await DoctorProfile.create({
          user: existingUser._id,
          ...doctorProfileData,
        });

        return res.status(201).json({
          requiresApproval: true,
          message: "Doctor account created. Waiting for admin approval.",
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            status: existingUser.status,
          },
        });
      }

      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      status: role === userRoles.doctor ? userStatus.pending : userStatus.active,
    });

    if (role === userRoles.doctor) {
      try {
        await DoctorProfile.create({
          user: newUser._id,
          ...doctorProfileData,
        });
      } catch (error) {
        await User.deleteOne({ _id: newUser._id });
        throw error;
      }

      return res.status(201).json({
        requiresApproval: true,
        message: "Doctor account created. Waiting for admin approval.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
      });
    }

    const token = generateToken(newUser);
    return res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong during registration.", error: error.message });
  }
}

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id).select("name email role status");
  if (!user) return res.status(404).json({ message: "Account not found." });

  const status = user.status || userStatus.active;
  if (status !== userStatus.active) {
    return res.status(403).json({ message: "This account is not active." });
  }

  return res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, status } });
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || !password
    ) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password." });

    const status = user.status || userStatus.active;
    if (status === userStatus.pending) {
      return res.status(403).json({ message: "Your doctor account is waiting for administrator approval." });
    }
    if (status === userStatus.rejected) {
      return res.status(403).json({ message: "Your doctor account request was rejected. Please contact the administrator." });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, status },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong during login.", error: error.message });
  }
}

export async function getPendingDoctors(req, res) {
  try {
    const doctors = await User.find({ role: userRoles.doctor, status: userStatus.pending })
      .select("name email role status createdAt")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      doctors: doctors.map((doctor) => ({
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        status: doctor.status,
        createdAt: doctor.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load pending doctor accounts.", error: error.message });
  }
}

export async function updateDoctorApproval(req, res) {
  try {
    const { status } = req.body;
    if (!doctorApprovalStatuses.includes(status)) {
      return res.status(400).json({ message: "Status must be active or rejected." });
    }

    const doctor = await User.findOne({ _id: req.params.id, role: userRoles.doctor });
    if (!doctor) return res.status(404).json({ message: "Doctor account not found." });
    if (doctor.status !== userStatus.pending) {
      return res.status(409).json({ message: "This doctor request has already been processed." });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctor._id });

    if (status === userStatus.rejected) {
      if (doctorProfile) {
        await Prescription.deleteMany({ doctor: doctorProfile._id });
        await Appointment.deleteMany({ doctor: doctorProfile._id });
        await DoctorProfile.deleteOne({ _id: doctorProfile._id });
      }

      await User.deleteOne({ _id: doctor._id });

      return res.status(200).json({
        message: "Doctor account rejected and all related details removed.",
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
          status: userStatus.rejected,
        },
      });
    }

    if (status === userStatus.active && !doctorProfile) {
      return res.status(409).json({
        message: "Doctor profile is missing. Ask the doctor to submit the registration form again.",
      });
    }

    doctor.status = userStatus.active;
    doctor.approvedAt = new Date();
    doctor.approvedBy = req.user.id;
    await doctor.save();

    if (doctorProfile) {
      doctorProfile.status = doctorProfileStatus.active;
      await doctorProfile.save();
    }

    return res.status(200).json({
      message: "Doctor account approved.",
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, role: doctor.role, status: doctor.status },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update doctor approval.", error: error.message });
  }
}
export {
  getMyProfile,
};
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch profile.",
      error: error.message,
    });
  }
};
