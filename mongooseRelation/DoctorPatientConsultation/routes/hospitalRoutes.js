const express = require("express");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Consultation = require("../models/Consultation");

const router = express.Router();

// POST /doctors
router.post("/doctors", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /patients
router.post("/patients", async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /consultations
router.post("/consultations", async (req, res) => {
  try {
    const { doctorId, patientId, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor?.isActive || !patient?.isActive) {
      return res.status(400).json({ error: "Doctor or Patient is inactive" });
    }

    const consultation = await Consultation.create({
      doctorId,
      patientId,
      notes,
    });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /doctors/:id/patients
router.get("/doctors/:id/patients", async (req, res) => {
  try {
    const consultations = await Consultation.find({
      doctorId: req.params.id,
      isActive: true,
    })
      .populate("patientId", "name age gender")
      .sort({ consultedAt: -1 })
      .limit(10);

    const patients = consultations.map((c) => c.patientId);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /patients/:id/doctors
router.get("/patients/:id/doctors", async (req, res) => {
  try {
    const consultations = await Consultation.find({
      patientId: req.params.id,
      isActive: true,
    }).populate("doctorId", "name specialization");

    const doctors = consultations.map((c) => c.doctorId);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /doctors/:id/consultations/count
router.get("/doctors/:id/consultations/count", async (req, res) => {
  try {
    const count = await Consultation.countDocuments({
      doctorId: req.params.id,
      isActive: true,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /patients?gender=Male
router.get("/patients", async (req, res) => {
  try {
    const { gender } = req.query;
    const patients = await Patient.find({ gender, isActive: true });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /consultations/recent
router.get("/consultations/recent", async (req, res) => {
  try {
    const consultations = await Consultation.find({ isActive: true })
      .sort({ consultedAt: -1 })
      .limit(5)
      .populate("doctorId", "name")
      .populate("patientId", "name");

    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /doctors/:id (soft delete + cascade)
router.delete("/doctors/:id", async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany(
      { doctorId: req.params.id },
      { isActive: false }
    );
    res.json({ msg: "Doctor and related consultations marked inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /patients/:id (soft delete + cascade)
router.delete("/patients/:id", async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany(
      { patientId: req.params.id },
      { isActive: false }
    );
    res.json({ msg: "Patient and related consultations marked inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
