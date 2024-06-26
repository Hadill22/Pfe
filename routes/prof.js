const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const isAuth = require("../middlewares/auth");
const absence = require("../models/absence");
const Note = require("../models/Notes");
// Create a Course
router.post("/courses", async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Courses
// router.get("/courses", async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get Course by ID
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Course
router.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Course
router.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Courses Added by a Professor
router.get("/professors/:profId/courses", async (req, res) => {
  try {
    const courses = await Course.find({ addedBy: req.params.profId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add absences for all students in a class with default situation "absence"
router.post("/absences/multi", isAuth, async (req, res) => {
  const { students } = req.body;
  try {
    const absences = students.map((student) => ({
      student: student._id,
      addedBy: req.user._id,
      time: new Date(),
    }));

    // Bulk insert absences
    await absence.insertMany(absences);

    res.status(201).json({ message: "Absences added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create a note
router.post("/Notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get a single note by ID
router.get("/Notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a note
router.put("/Notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note
router.delete("/Notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes by professor
router.get("/Notes/prof/:profId", async (req, res) => {
  const { profId } = req.params;

  try {
    const notes = await Note.find({ addedBy: profId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
