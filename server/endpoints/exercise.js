import { Exercise } from "../models/exercise.js";

export const exerciseEndpoints = (app) => {
  // Get all exercises for a workout
  app.get("/api/workouts/:workoutId/exercises", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.workoutId);
      const exercises = await Exercise.getAll(workoutId);
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
      const exercise = await Exercise.create(workoutId, name);
      res.json(exercise);
    } catch (error) {
      console.error("Error creating exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an exercise
  app.delete("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await Exercise.delete(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update exercise name
  app.patch("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;
      const exercise = await Exercise.update(id, name);
      res.json(exercise);
    } catch (error) {
      console.error("Error updating exercise:", error);
      res.status(500).json({ error: error.message });
    }
  });
}; 