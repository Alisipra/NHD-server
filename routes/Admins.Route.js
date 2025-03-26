const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
require("dotenv").config();

const { AdminModel } = require("../models/Admin.model");
const { NurseModel } = require("../models/Nurse.model");
const { DoctorModel } = require("../models/Doctor.model");
const { PatientModel } = require("../models/Patient.model");

const router = express.Router();

// ✅ Get all Admins
router.get("/", async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Admin Registration
router.post("/register", async (req, res) => {
  try {
    // const { adminID, email, password, name } = req.body;
    const { adminName,
      adminID,
      age,
      mobile,
      email,
      gender,
      DOB,
      address,
      education,
      password,
    }=req.body;
    // ✅ Validate Input
    if (!adminID || !email || !password || !adminName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check If Admin Already Exists
    const existingAdmin = await AdminModel.findOne({ adminID });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // ✅ Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save New Admin
    const newAdmin = new AdminModel({
      adminID,
      email,
      password: hashedPassword,
      adminName,
    });

    await newAdmin.save();

    return res.status(201).json({ message: "Registered Successfully", data: newAdmin });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Admin Login
router.post("/login", async (req, res) => {
  try {
    const { adminID, password } = req.body;

    const admin = await AdminModel.findOne({ adminID });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login Successful", user: admin, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Update Admin
router.patch("/:adminId", async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndUpdate(req.params.adminId, req.body, { new: true });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Delete Admin
router.delete("/:adminId", async (req, res) => {
  try {
    const admin = await AdminModel.findByIdAndDelete(req.params.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Forgot Password (Send Email)
router.post("/forgot", async (req, res) => {
  try {
    const { email, type } = req.body;
    let user;

    if (type === "nurse") user = await NurseModel.findOne({ email });
    if (type === "patient") user = await PatientModel.findOne({ email });
    if (type === "admin") user = await AdminModel.findOne({ email });
    if (type === "doctor") user = await DoctorModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account ID and Password",
      text: `Your User ID: ${user._id}\nYour Password: ${user.password}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
