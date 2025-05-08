import Workouts from "../../../../models/workout";
import Exercises from "../../../../models/exercise";
import { useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Trash, Pencil, Check, X } from "@phosphor-icons/react";

export default function SelectWorkoutModal({
  workouts,
  setWorkouts,
  setShowWorkoutModal,
  setExercises,
  setSelectedWorkout,
}) {
  const { userId } = useAuth();
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [error, setError] = useState(null);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [editWorkoutName, setEditWorkoutName] = useState("");
  const cancelEditRef = useRef(false);

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) return;
    try {
      setError(null);
      const workout = await Workouts.create(userId, newWorkoutName);
      setWorkouts([workout, ...workouts]);
      setNewWorkoutName("");
    } catch (error) {
      console.error("Error creating workout:", error);
      setError(error.message || "Failed to create workout");
    }
  };

  const deleteWorkout = async (e, workout) => {
    e.stopPropagation(); // Prevent workout selection when deleting
    try {
      await Workouts.delete(userId, workout.id);
      // Create a new array to force React to recognize the change
      const updatedWorkouts = [...workouts].filter((w) => w.id !== workout.id);
      setWorkouts(updatedWorkouts);
      // Clear selected workout if it was the one being deleted
      setSelectedWorkout(null);
      setExercises([]);
    } catch (error) {
      console.error("Error deleting workout:", error);
      setError(error.message || "Failed to delete workout");
    }
  };

  const startEditingWorkout = (workout) => {
    setEditingWorkoutId(workout.id);
    setEditWorkoutName(workout.name);
    cancelEditRef.current = false;
  };

  const cancelEditingWorkout = () => {
    setEditingWorkoutId(null);
    setEditWorkoutName("");
  };

  const updateWorkout = async (workout) => {
    if (!editWorkoutName.trim()) return;
    try {
      await Workouts.update(userId, workout.id, editWorkoutName);
      const updatedWorkouts = workouts.map((w) =>
        w.id === workout.id ? { ...w, name: editWorkoutName } : w
      );
      setWorkouts(updatedWorkouts);
      setEditingWorkoutId(null);
      setEditWorkoutName("");
      cancelEditRef.current = false;
    } catch (error) {
      console.error("Error updating workout:", error);
      setError(error.message || "Failed to update workout");
    }
  };

  const selectWorkout = async (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(false);
    const exercises = await Exercises.all(userId, workout.id);
    setExercises(exercises);
  };


  return (
    <div
      className="fixed inset-0 bg-gray-900/30 flex items-center justify-center backdrop-blur-sm"
      onClick={() => setShowWorkoutModal(false)}
    >
      <div
        className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Workout</h2>
          <button
            onClick={() => {
              setShowWorkoutModal(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Create New Workout */}
        <div className="mb-6 flex gap-2">
          <input
            disabled={!userId}
            type="text"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            placeholder="New Workout Name"
            className="border rounded px-3 py-2 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createWorkout();
              }
            }}
          />
          <button
            onClick={createWorkout}
            disabled={!newWorkoutName.trim()}
            className={`px-4 py-2 rounded-md ${
              !newWorkoutName.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Create
          </button>
        </div>

        {/* Workout List */}
        <div className="space-y-2">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="p-3 border rounded-lg flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
            >
              <button
                onClick={(e) => deleteWorkout(e, workout)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash size={20} weight="regular" />
              </button>
              <button
                onClick={() => startEditingWorkout(workout)}
                className="text-blue-400 hover:text-blue-600 transition-colors"
                disabled={editingWorkoutId === workout.id}
              >
                <Pencil size={20} weight="regular" />
              </button>
              {editingWorkoutId === workout.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editWorkoutName}
                    onChange={(e) => setEditWorkoutName(e.target.value)}
                    className="border rounded px-2 py-1 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateWorkout(workout);
                      else if (e.key === "Escape") cancelEditingWorkout();
                    }}
                    onBlur={() => {
                      if (cancelEditRef.current) {
                        cancelEditRef.current = false;
                        return;
                      }
                      if (editWorkoutName.trim()) updateWorkout(workout);
                      else cancelEditingWorkout();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => updateWorkout(workout)}
                    className="text-green-400 hover:text-green-600 transition-colors"
                  >
                    <Check size={20} weight="regular" />
                  </button>
                  <button
                    onMouseDown={() => { cancelEditRef.current = true; }}
                    onClick={cancelEditingWorkout}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={20} weight="regular" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => selectWorkout(workout)}
                  className="flex-1 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(workout.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-blue-500">Select →</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
