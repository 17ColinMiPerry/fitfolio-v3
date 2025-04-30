import { useEffect, useState } from "react";
import { Pencil, Trash, X, Check } from "@phosphor-icons/react";
import Exercises from "../../../models/exercise";
import Sets from "../../../models/set";

export default function CurrentWorkout() {
  const [exercises, setExercises] = useState([]);

  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editExerciseName, setEditExerciseName] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [editingSetId, setEditingSetId] = useState(null);
  const [editSetReps, setEditSetReps] = useState("");
  const [editSetWeight, setEditSetWeight] = useState("");
  
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const deleteExercise = async (id) => {
    await Exercises.delete(id);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
  };

  const deleteSet = async (exerciseId, setId) => {
    await Sets.delete(exerciseId, setId);
    
    // Update the selected exercise's sets in state by filtering out the deleted set
    setSelectedExercise(prev => ({
      ...prev,
      sets: prev.sets.filter(set => set.id !== setId)
    }));
    
    // Update the exercises list to remove the deleted set
    setExercises(prev => 
      prev.map(exercise =>
        exercise.id === exerciseId 
          ? { 
              ...exercise, 
              sets: exercise.sets.filter(set => set.id !== setId)
            }
          : exercise
      )
    );
  };
  

  const createExercise = async (name) => {
    await Exercises.create(name);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
  };

  const createSet = async (exerciseId, reps, weight) => {
    try {
      // Validate inputs
      if (!reps || !weight) {
        return; // Don't proceed if either field is empty
      }

      const newSet = await Sets.create(exerciseId, parseInt(reps), parseFloat(weight));
      if (newSet) {
        // Update the selected exercise's sets in state
        setSelectedExercise(prev => ({
          ...prev,
          sets: [...(prev.sets || []), newSet]
        }));
        
        // Update the exercises list to include the new set
        setExercises(prev => 
          prev.map(exercise => 
            exercise.id === exerciseId 
              ? { ...exercise, sets: [...(exercise.sets || []), newSet] }
              : exercise
          )
        );
        
        // Clear the form inputs
        setReps("");
        setWeight("");
      }
    } catch (error) {
      console.error("Error creating set:", error);
    }
  };

  const updateExercise = async (id, name) => {
    await Exercises.update(id, name);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
    setEditingExerciseId(null);
  };

  const startEditingExercise = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditExerciseName(exercise.name);
  };

  const startEditingSet = (set) => {
    setEditingSetId(set.id);
    setEditSetReps(set.reps);
    setEditSetWeight(set.weight);
  };

  const cancelEditingSet = () => {
    setEditingSetId(null);
    setEditSetReps("");
    setEditSetWeight("");
  };

  const updateSet = async (exerciseId, setId, reps, weight) => {
    try {
      // Validate inputs
      if (!reps || !weight) {
        return; // Don't proceed if either field is empty
      }

      await Sets.update(exerciseId, setId, { 
        reps: parseInt(reps), 
        weight: parseFloat(weight) 
      });
      
      // Update the selected exercise's sets in state
      setSelectedExercise(prev => ({
        ...prev,
        sets: prev.sets.map(set => 
          set.id === setId 
            ? { ...set, reps: parseInt(reps), weight: parseFloat(weight) }
            : set
        )
      }));
      
      // Update the exercises list
      setExercises(prev => 
        prev.map(exercise =>
          exercise.id === exerciseId 
            ? { 
                ...exercise, 
                sets: exercise.sets.map(set => 
                  set.id === setId 
                    ? { ...set, reps: parseInt(reps), weight: parseFloat(weight) }
                    : set
                )
              }
            : exercise
        )
      );
      
      setEditingSetId(null);
    } catch (error) {
      console.error("Error updating set:", error);
    }
  };
  

  const openExerciseModal = (exercise) => {
    setSelectedExercise(exercise);
  };

  const closeExerciseModal = () => {
    setSelectedExercise(null);
  };

  const cancelEditingExercise = () => {
    setEditingExerciseId(null);
    setEditExerciseName("");
  };

  useEffect(() => {
    const fetchExercises = async () => {
      const exercises = await Exercises.all();
      setExercises(exercises);
    };
    fetchExercises();
  }, []);

  return (
    <div className="w-[625px] h-[725px] bg-white rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-2">Current Workout</h1>
      <div className="text-sm text-gray-600 mb-4">
        Track your exercises and progress
      </div>

      <div className="overflow-x-auto">
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
            {exercises.map((exercise) => (
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
                          updateExercise(exercise.id, editExerciseName);
                        } else if (e.key === "Escape") {
                          cancelEditingExercise();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2 py-[7px]">
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => openExerciseModal(exercise)}
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
                    {new Date(exercise.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingExerciseId === exercise.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateExercise(exercise.id, editExerciseName)}
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
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-2">
        <button
          onClick={() => createExercise("New Exercise")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </div>

      {/* Sets Modal */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 bg-gray-900/30 flex items-center justify-center backdrop-blur-sm"
          onClick={closeExerciseModal}
        >
          <div 
            className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedExercise.name} Sets</h2>
              <button
                onClick={closeExerciseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Add New Set Form */}
            <div className="mb-4 flex gap-2">
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                className="border rounded px-2 py-1 w-20"
                onChange={(e) => setReps(e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight"
                value={weight}
                className="border rounded px-2 py-1 w-20"
                onChange={(e) => setWeight(e.target.value)}
              />
              <button
                className={`px-4 py-1 rounded-md ${
                  !reps || !weight 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => createSet(selectedExercise.id, reps, weight)}
                disabled={!reps || !weight}
              >
                Add Set
              </button>
            </div>

            {/* Sets Table */}
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Set</th>
                  <th className="w-2/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reps</th>
                  <th className="w-2/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedExercise.sets?.map((set, index) => (
                  <tr key={set.id}>
                    <td className="px-4 py-[13px]">{index + 1}</td>
                    <td className="px-4 py-2">
                      {editingSetId === set.id ? (
                        <input
                          type="number"
                          value={editSetReps}
                          onChange={(e) => setEditSetReps(e.target.value)}
                          className="border rounded px-2 py-1 w-20"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateSet(selectedExercise.id, set.id, editSetReps, editSetWeight);
                            } else if (e.key === "Escape") {
                              cancelEditingSet();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        set.reps
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingSetId === set.id ? (
                        <input
                          type="number"
                          value={editSetWeight}
                          onChange={(e) => setEditSetWeight(e.target.value)}
                          className="border rounded px-2 py-1 w-20"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateSet(selectedExercise.id, set.id, editSetReps, editSetWeight);
                            } else if (e.key === "Escape") {
                              cancelEditingSet();
                            }
                          }}
                        />
                      ) : (
                        set.weight
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingSetId === set.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSet(selectedExercise.id, set.id, editSetReps, editSetWeight)}
                            className="text-green-400 hover:text-green-600 transition-colors"
                          >
                            <Check size={16} weight="regular" />
                          </button>
                          <button
                            onClick={cancelEditingSet}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X size={16} weight="regular" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditingSet(set)}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Pencil size={16} weight="regular" />
                          </button>
                          <button
                            onClick={() => deleteSet(selectedExercise.id, set.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash size={16} weight="regular" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
