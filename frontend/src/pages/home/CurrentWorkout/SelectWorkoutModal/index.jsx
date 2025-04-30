import Workouts from "../../../../models/workout";
import Exercises from "../../../../models/exercise";
import { useState, useEffect } from "react";

export default function SelectWorkoutModal({
  setShowWorkoutModal,
  setExercises,
  setSelectedWorkout,
}) {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");

  const fetchWorkouts = async () => {
    const workouts = await Workouts.all();
    setWorkouts(workouts);
  };

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) return;
    const workout = await Workouts.create(newWorkoutName);
    setWorkouts([workout, ...workouts]);
    setNewWorkoutName("");
  };

  const selectWorkout = async (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(false);
    const exercises = await Exercises.all(workout.id);
    setExercises(exercises);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center backdrop-blur-sm">
      <div
        className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Workout</h2>
          <button
            onClick={() => setShowWorkoutModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Create New Workout */}
        <div className="mb-6 flex gap-2">
          <input
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
              onClick={() => selectWorkout(workout)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{workout.name}</div>
                <div className="text-sm text-gray-500">
                  Created {new Date(workout.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-blue-500">Select →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
