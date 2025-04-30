import express from "express";
import cors from "cors";
import { workoutEndpoints } from "./endpoints/workout.js";
import { exerciseEndpoints } from "./endpoints/exercise.js";
import { setEndpoints } from "./endpoints/set.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message:
      "Fitfolio API is running! Use /api/exercises to access the exercises endpoint.",
  });
});

// Initialize endpoints
workoutEndpoints(app);
exerciseEndpoints(app);
setEndpoints(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
