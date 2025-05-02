import Workouts from "../../../../models/workout";
import Exercises from "../../../../models/exercise";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Trash } from "@phosphor-icons/react";

export default function SelectWorkoutModal({
  setShowWorkoutModal,
  setExercises,
  setSelectedWorkout,
}) {
  const { userId } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [error, setError] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const workouts = await Workouts.all(userId);
      setWorkouts(workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts');
    }
  };

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) return;
    try {
      setError(null);
      const workout = await Workouts.create(userId, newWorkoutName);
      setWorkouts([workout, ...workouts]);
      setNewWorkoutName("");
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(error.message || 'Failed to create workout');
    }
  };

  const deleteWorkout = async (e, workout) => {
    e.stopPropagation(); // Prevent workout selection when deleting
    try {
      await Workouts.delete(userId, workout.id);
      setWorkouts(workouts.filter((w) => w.id !== workout.id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      setError(error.message || 'Failed to delete workout');
    }
  };

  const selectWorkout = async (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(false);
    const exercises = await Exercises.all(userId, workout.id);
    setExercises(exercises);
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
