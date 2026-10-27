
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Kiểm tra dữ liệu nhân viên
function validateEmployee(data) {
  if (!data.employeeId?.trim()) {
    return "Ma nhan vien khong duoc de trong";
  }

  if (!data.fullName?.trim()) {
    return "Ho ten khong duoc de trong";
  }

  if (!data.email?.trim()) {
    return "Email khong duoc de trong";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Email khong hop le";
  }

  return null;
}

// GET - Danh sách và tìm kiếm nhân viên
router.get("/", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    let filter = {};

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter = {
        $or: [
          { employeeId: { $regex: escaped, $options: "i" } },
          { fullName: { $regex: escaped, $options: "i" } }
        ]
      };
    }

    const employees = await Employee.find(filter)
      .sort({ employeeId: 1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Khong the lay danh sach nhan vien"
    });
  }
});

// GET - Xem chi tiết theo mã nhân viên
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.id
    });

    if (!employee) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay thong tin nhan vien"
    });
  }
});

// POST - Thêm nhân viên
router.post("/", async (req, res) => {
  try {
    const error = validateEmployee(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const existing = await Employee.findOne({
      employeeId: req.body.employeeId
    });

    if (existing) {
      return res.status(409).json({
        message: "Ma nhan vien da ton tai"
      });
    }

    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({
      message: "Them nhan vien thanh cong",
      employee
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Ma nhan vien da ton tai"
      });
    }

    res.status(500).json({
      message: "Loi khi them nhan vien"
    });
  }
});

// PUT - Cập nhật nhân viên
router.put("/:id", async (req, res) => {
  try {
    const current = await Employee.findOne({
      employeeId: req.params.id
    });

    if (!current) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    const updatedData = {
      ...current.toObject(),
      ...req.body,
      employeeId: current.employeeId
    };

    const error = validateEmployee(updatedData);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      { $set: {
        fullName: updatedData.fullName,
        gender: updatedData.gender,
        dateOfBirth: updatedData.dateOfBirth,
        department: updatedData.department,
        position: updatedData.position,
        email: updatedData.email,
        phone: updatedData.phone,
        hireDate: updatedData.hireDate,
        status: updatedData.status
      }},
      { new: true, runValidators: true }
    );

    res.json({
      message: "Cap nhat thanh cong",
      employee
    });
  } catch (error) {
    res.status(500).json({
      message: "Loi khi cap nhat nhan vien"
    });
  }
});

// DELETE - Xóa nhân viên
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeId: req.params.id
    });

    if (!employee) {
      return res.status(404).json({
        message: "Khong tim thay nhan vien"
      });
    }

    res.json({
      message: "Xoa nhan vien thanh cong"
    });
  } catch (error) {
    res.status(500).json({
      message: "Loi khi xoa nhan vien"
    });
  }
});

module.exports = router;
