import { useState, useEffect } from "react";
import { API_URL } from "../utils/constants";

export function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all exercises
  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setExercises(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new exercise
  const addExercise = async (name) => {
    try {
      const response = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setExercises((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add set to exercise
  const addSet = async (exerciseId, { reps, weight }) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${exerciseId}/sets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reps, weight }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Update exercises state with new set
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: [...exercise.sets, data],
            };
          }
          return exercise;
        }),
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete exercise
  const deleteExercise = async (exerciseId) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      setExercises((prev) =>
        prev.filter((exercise) => exercise.id !== exerciseId),
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update exercise name
  const updateExercise = async (exerciseId, newName) => {
    try {
      const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id === exerciseId
            ? { ...exercise, name: newName }
            : exercise,
        ),
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fetch exercises on mount
  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    loading,
    error,
    addExercise,
    addSet,
    deleteExercise,
    updateExercise,
    refreshExercises: fetchExercises,
  };
}
