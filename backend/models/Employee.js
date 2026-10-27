
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    default: ""
  },
  dateOfBirth: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  position: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    default: ""
  },
  hireDate: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "Dang lam viec"
  }
});

module.exports = mongoose.model(
  "Employee",
  employeeSchema,
  "employees"
);
