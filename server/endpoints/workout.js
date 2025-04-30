import { Workout } from "../models/workout.js";

export const workoutEndpoints = (app) => {
  // Get all workouts
  app.get("/api/workouts", async (req, res) => {
    try {
      const workouts = await Workout.getAll();
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new workout
  app.post("/api/workouts", async (req, res) => {
    try {
      const { name } = req.body;
      const workout = await Workout.create(name);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a workout
  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Workout.delete(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a workout
  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Workout.update(id, name);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });
}; 