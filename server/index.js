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

// Get all exercises for a workout
app.get("/api/workouts/:workoutId/exercises", async (req, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId);
    const exercises = await prisma.exercise.findMany({
      where: { workoutId },
      include: {
        sets: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new exercise
app.post("/api/workouts/:workoutId/exercises", async (req, res) => {
  try {
    const workoutId = parseInt(req.params.workoutId);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        workoutId,
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
    // First delete all sets associated with this exercise
    await prisma.set.deleteMany({
      where: { exerciseId },
    });
    // Then delete the exercise
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

// Delete a set
app.delete("/api/exercises/:exerciseId/sets/:setId", async (req, res) => {
  try {
    const setId = parseInt(req.params.setId);
    await prisma.set.delete({
      where: { id: setId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting set:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a set
app.put("/api/exercises/:exerciseId/sets/:setId", async (req, res) => {
  try {
    const setId = parseInt(req.params.setId);
    const { reps, weight } = req.body;
    
    const updatedSet = await prisma.set.update({
      where: { id: setId },
      data: {
        reps: parseInt(reps),
        weight: parseFloat(weight),
      },
    });
    
    res.json(updatedSet);
  } catch (error) {
    console.error("Error updating set:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// Workouts
app.get("/api/workouts", async (req, res) => {
  const workouts = await prisma.workout.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  res.json(workouts);
});

app.post("/api/workouts", async (req, res) => {
  const { name } = req.body;
  const workout = await prisma.workout.create({
    data: { name },
  });
  res.json(workout);
});

app.delete("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.workout.delete({
    where: { id: parseInt(id) },
  });
  res.json({ success: true });
});

app.put("/api/workouts/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await prisma.workout.update({
    where: { id: parseInt(id) },
    data: { name },
  });
  res.json({ success: true });
});
