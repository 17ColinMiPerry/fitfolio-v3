import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message:
      "Fitfolio API is running! Use /api/exercises to access the exercises endpoint.",
  });
});

// Get all exercises
app.get("/api/exercises", async (req, res) => {
  console.log("Fetching exercises");
  try {
    const exercises = await prisma.exercise.findMany({
      include: {
        sets: true,
      },
    });
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new exercise
app.post("/api/exercises", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: name,
      },
      include: {
        sets: true,
      },
    });

    res.json(exercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a set to an exercise
app.post("/api/exercises/:id/sets", async (req, res) => {
  try {
    const { reps, weight } = req.body;
    const exerciseId = parseInt(req.params.id);
    const set = await prisma.set.create({
      data: {
        reps: parseInt(reps),
        weight: parseFloat(weight),
        exerciseId,
      },
    });
    res.json(set);
  } catch (error) {
    console.error("Error adding set:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an exercise
app.delete("/api/exercises/:id", async (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    await prisma.set.deleteMany({
      where: { exerciseId },
    });
    await prisma.exercise.delete({
      where: { id: exerciseId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update exercise name
app.patch("/api/exercises/:id", async (req, res) => {
  try {
    const exerciseId = parseInt(req.params.id);
    const { name } = req.body;
    const exercise = await prisma.exercise.update({
      where: { id: exerciseId },
      data: { name },
      include: { sets: true },
    });
    res.json(exercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
