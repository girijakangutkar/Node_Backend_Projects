const express = require("express");
const NoteModel = require("../model/NoteModel");
const NotesRouter = express.Router();

NotesRouter.get("/notes", async (req, res) => {
  try {
    const user = await NoteModel.find({ createdBy: req.userId });
    res.status(200).json({ msg: "Success", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

NotesRouter.post("/notes", async (req, res) => {
  try {
    const newNote = { ...req.body, createdBy: req.userId };
    const addData = await NoteModel.create(newNote);
    res.status(201).json({ msg: "Note added", addData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

NotesRouter.put("/notes/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const userNotes = await NoteModel.findByIdAndUpdate(
      { _id: req.params.id, createdBy: userId },
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "Note updated", userNotes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

NotesRouter.delete("/notes/:id", async (req, res) => {
  try {
    const userId = req.params;
    let findNote = await NoteModel.findByIdAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });
    if (!findNote) return res.status(404).json({ msg: "Note not found" });
    res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

module.exports = NotesRouter;
