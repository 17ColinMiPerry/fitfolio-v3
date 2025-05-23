import { useState, useRef, useEffect } from "react";
import { Pencil, Trash, X, Check } from "@phosphor-icons/react";

import { useAuth } from "@clerk/clerk-react";
import Exercises from "../../../models/exercise";
import AddSetModal from "./AddSetModal";
import SelectWorkoutModal from "./SelectWorkoutModal";

export default function CurrentWorkout({ workouts, setWorkouts }) {
  const { userId } = useAuth();

  const [exercises, setExercises] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editExerciseName, setEditExerciseName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(false);
  const [showAddSetModal, setShowAddSetModal] = useState(false);

  // Ref for the scrollable table container
  const tableContainerRef = useRef(null);

  // Scroll to bottom when exercises change
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
    }
  }, [exercises]);

  const deleteExercise = async (id) => {
    if (!selectedWorkout) return;
    await Exercises.delete(userId, id);
    const updatedExercises = await Exercises.all(userId, selectedWorkout.id);
    setExercises(updatedExercises);
  };

  const createExercise = async (name) => {
    if (!selectedWorkout) return;
    await Exercises.create(userId, selectedWorkout.id, name);
    const updatedExercises = await Exercises.all(userId, selectedWorkout.id);
    setExercises(updatedExercises);
  };

  const updateExercise = async (id, name) => {
    if (!selectedWorkout) return;
    await Exercises.update(userId, id, name);
    const updatedExercises = await Exercises.all(userId, selectedWorkout.id);
    setExercises(updatedExercises);
    setEditingExerciseId(null);
  };

  const startEditingExercise = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditExerciseName(exercise.name);
  };

  const cancelEditingExercise = () => {
    setEditingExerciseId(null);
    setEditExerciseName("");
  };

  const closeAddSetModal = () => {
    setShowAddSetModal(false);
    setSelectedExercise(null);
  };

  const openAddSetModal = (exercise) => {
    setSelectedExercise(exercise);
    setShowAddSetModal(true);
  };

  if (!selectedWorkout) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Your Workout</h1>
        <button
          onClick={() => setShowWorkoutModal(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Select a Workout
        </button>

        {/* Workout Selection Modal */}
        {showWorkoutModal && (
          <SelectWorkoutModal
            workouts={workouts}
            setWorkouts={setWorkouts}
            setShowWorkoutModal={setShowWorkoutModal}
            setExercises={setExercises}
            setSelectedWorkout={setSelectedWorkout}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-8 h-full w-full">
      <h1 className="text-3xl font-semibold mb-6">Current Workout</h1>
      <div className="flex flex-col bg-white rounded-lg shadow-sm p-6 h-[90%]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{selectedWorkout.name}</h2>
            <div className="text-sm text-gray-600">
              Created {new Date(selectedWorkout.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedWorkout(null);
              setShowWorkoutModal(true);
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            Change Workout
          </button>
        </div>

        <div ref={tableContainerRef} className="overflow-x-auto overflow-y-auto flex-1">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/2 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
                <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="w-1/4 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...exercises]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((exercise) => (
                  <tr key={exercise.id} className="hover:bg-gray-50">
                    <td className="w-1/2 px-6 py-4 whitespace-nowrap">
                      {editingExerciseId === exercise.id ? (
                        <input
                          type="text"
                          value={editExerciseName}
                          onChange={(e) => setEditExerciseName(e.target.value)}
                          className="border rounded px-2 py-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (editExerciseName.trim()) {
                                updateExercise(exercise.id, editExerciseName);
                              } else {
                                cancelEditingExercise();
                              }
                            } else if (e.key === "Escape") {
                              cancelEditingExercise();
                            }
                          }}
                          onBlur={() => {
                            if (editExerciseName.trim()) {
                              updateExercise(exercise.id, editExerciseName);
                            } else {
                              cancelEditingExercise();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2 py-[7px]">
                          <div
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => openAddSetModal(exercise)}
                          >
                            {exercise.name}
                          </div>
                          <button
                            onClick={() => startEditingExercise(exercise)}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil size={20} weight="regular" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(exercise.createdAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingExerciseId === exercise.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateExercise(exercise.id, editExerciseName)
                            }
                            className="text-green-400 hover:text-green-600 transition-colors"
                          >
                            <Check size={20} weight="regular" />
                          </button>
                          <button
                            onClick={cancelEditingExercise}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={20} weight="regular" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => deleteExercise(exercise.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash size={20} weight="regular" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              <tr>
                <td colSpan={3} className="py-4">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => createExercise("New Exercise")}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add Exercise
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sets Modal */}
      {showAddSetModal && (
        <AddSetModal
          selectedExercise={selectedExercise}
          closeAddSetModal={closeAddSetModal}
          setSelectedExercise={setSelectedExercise}
          setExercises={setExercises}
        />
      )}

      {/* Workout Selection Modal */}
      {showWorkoutModal && (
        <SelectWorkoutModal
          workouts={workouts}
          setWorkouts={setWorkouts}
          setShowWorkoutModal={setShowWorkoutModal}
          setExercises={setExercises}
          setSelectedWorkout={setSelectedWorkout}
        />
      )}
    </div>
  );
}
