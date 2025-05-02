import { Set } from "../models/set.js";

export const setEndpoints = (app) => {
  // Add a set to an exercise
  app.post("/api/exercises/:id/sets", async (req, res) => {
    try {
      const { reps, weight } = req.body;
      const exerciseId = parseInt(req.params.id);
      const set = await Set.create(exerciseId, reps, weight);
      res.json(set);
    } catch (error) {
      console.error("Error adding set:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a set
  app.delete("/api/exercises/:exerciseId/sets/:setId", async (req, res) => {
    try {
      const setId = parseInt(req.params.setId);
      await Set.delete(setId);
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
      const updatedSet = await Set.update(setId, reps, weight);
      res.json(updatedSet);
    } catch (error) {
      console.error("Error updating set:", error);
      res.status(500).json({ error: error.message });
    }
  });
};
