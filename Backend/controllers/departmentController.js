import Department from "../models/Department.js";
import { departmentStatuses } from "../constants/departmentConstants.js";

export async function getDepartments(req, res) {
  try {
    const departments = await Department.find({ status: departmentStatuses.active })
      .select("name description status createdAt updatedAt")
      .sort({ name: 1 });

    return res.status(200).json({ departments });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load departments.",
      error: error.message,
    });
  }
}

export async function createDepartment(req, res) {
  try {
    const { name, description = "" } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const normalizedName = name.trim();
    const existingDepartment = await Department.findOne({
      name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existingDepartment) {
      return res.status(409).json({ message: "A department with this name already exists." });
    }

    const department = await Department.create({
      name: normalizedName,
      description: typeof description === "string" ? description.trim() : "",
    });

    return res.status(201).json({
      message: "Department created successfully.",
      department,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create department.",
      error: error.message,
    });
  }
}

export async function updateDepartment(req, res) {
  try {
    const { name, description, status } = req.body;
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Department name cannot be empty." });
      }
      department.name = name.trim();
    }

    if (description !== undefined) {
      department.description = typeof description === "string" ? description.trim() : "";
    }

    if (status !== undefined) {
      if (!Object.values(departmentStatuses).includes(status)) {
        return res.status(400).json({ message: "Invalid department status." });
      }
      department.status = status;
    }

    await department.save();

    return res.status(200).json({
      message: "Department updated successfully.",
      department,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "A department with this name already exists." });
    }

    return res.status(500).json({
      message: "Unable to update department.",
      error: error.message,
    });
  }
}
