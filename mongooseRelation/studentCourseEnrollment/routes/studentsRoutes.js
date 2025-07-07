const express = require("express");
const StudentModel = require("../models/StudentModel");
const JunctionModel = require("../models/EntrollmentModel");
const CourseModel = require("../models/CourseModel");

const StudentRoutes = express.Router();

StudentRoutes.get("/allList", async (req, res) => {
  try {
    const result = await StudentModel.find({});
    const info = await CourseModel.find({});
    res.status(200).json({ msg: "success", result, info });
  } catch (error) {
    res.status(500).json("something went wrong");
  }
});

StudentRoutes.post("/students", async (req, res) => {
  try {
    const newStudent = await StudentModel.create(req.body);
    res.status(201).json({ msg: "Student added successfully", newStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

StudentRoutes.post("/courses", async (req, res) => {
  try {
    const newCourse = await CourseModel.create(req.body);
    res.status(201).json({ msg: "Course added successfully", newCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

StudentRoutes.post("/enroll", async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await StudentModel.findById(studentId);
    const course = await CourseModel.findById(courseId);

    if (!student?.isActive || !course?.isActive) {
      return res.status(404).json("student or course is inactive");
    }

    const enroll = await JunctionModel.create({ studentId, courseId });
    res.status(201).json({ msg: "Student enrolled to the course", enroll });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

StudentRoutes.put("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const findEnroll = await StudentModel.findByIdAndUpdate(studentId, {
      isActive: false,
    });
    await JunctionModel.updateMany({ studentId }, { isActive: false });
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

StudentRoutes.put("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const findEnroll = await CourseModel.findByIdAndUpdate(courseId, {
      isActive: false,
    });

    await JunctionModel.updateMany({ courseId }, { isActive: false });
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

StudentRoutes.get("/students/:studentId/courses", async (req, res) => {
  try {
    const { studentId } = req.params;
    const students = await JunctionModel.find({
      studentId,
      isActive: true,
    }).populate("courseId");
    res.status(200).json({ msg: "List of course as per student", students });
  } catch (error) {
    console.log(error);
    res.status(404).json("something went wrong");
  }
});

StudentRoutes.get("/students/:courseId/students", async (req, res) => {
  try {
    const { courseId } = req.params;
    const students = await JunctionModel.find({
      courseId,
      isActive: true,
    }).populate("studentId");
    res.status(200).json({ msg: "List of course as per student", students });
  } catch (error) {
    console.log(error);
    res.status(404).json("something went wrong");
  }
});

module.exports = StudentRoutes;
