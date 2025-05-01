import { Workout } from "../models/workout.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const workoutEndpoints = (app) => {
  // Get all workouts for the current user
  app.get("/api/workouts", async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const workouts = await Workout.getAll(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new workout for the current user
  app.post("/api/workouts", async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Create user if they don't exist
      await prisma.user.upsert({
        where: { id: userId },
        update: {}, // No updates needed if user exists
        create: { id: userId }, // Create new user if they don't exist
      });

      const { name } = req.body;
      const workout = await Workout.create(userId, name);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a workout (only if owned by current user)
  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      await Workout.delete(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a workout (only if owned by current user)
  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id } = req.params;
      const { name } = req.body;
      await Workout.update(id, userId, name);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating workout:", error);
      res.status(500).json({ error: error.message });
    }
  });
}; 