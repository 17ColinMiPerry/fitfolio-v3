import { useState } from "react";
import Sets from "../../../../models/set";
import { Pencil, Trash, X, Check, NotePencil, CaretDown } from "@phosphor-icons/react";
import React from "react";

export default function AddSetModal({
  selectedExercise,
  closeAddSetModal,
  setSelectedExercise,
  setExercises,
}) {
  const [editingSetId, setEditingSetId] = useState(null);
  const [editSetReps, setEditSetReps] = useState("");
  const [editSetWeight, setEditSetWeight] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const truncateNote = (note) => {
    if (!note) return "";
    const lines = note.split('\n');
    if (lines.length <= 3) return note;
    return lines.slice(0, 3).join('\n') + '\n...';
  };

  const deleteSet = async (exerciseId, setId) => {
    await Sets.delete(exerciseId, setId);

    // Update the selected exercise's sets in state by filtering out the deleted set
    setSelectedExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((set) => set.id !== setId),
    }));

    // Update the exercises list to remove the deleted set
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise,
      ),
    );
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

  const startEditingNote = (set) => {
    setEditingNoteId(set.id);
    setEditNote(set.notes || "");
    setExpandedNoteId(set.id);
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditNote("");
  };

  const updateNote = async (exerciseId, setId, note) => {
    try {
      // Find the set to get current reps and weight
      const set = selectedExercise.sets.find((s) => s.id === setId);
      if (!set) throw new Error('Set not found');
      await Sets.update(exerciseId, setId, {
        reps: set.reps,
        weight: set.weight,
        notes: note,
      });

      // Update the selected exercise's sets in state
      setSelectedExercise((prev) => ({
        ...prev,
        sets: prev.sets.map((set) =>
          set.id === setId ? { ...set, notes: note } : set,
        ),
      }));

      // Update the exercises list
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === setId ? { ...set, notes: note } : set,
                ),
              }
            : exercise,
        ),
      );

      setEditingNoteId(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const updateSet = async (exerciseId, setId, reps, weight) => {
    try {
      // Validate inputs
      if (!reps || !weight) {
        return; // Don't proceed if either field is empty
      }

      await Sets.update(exerciseId, setId, {
        reps: parseInt(reps),
        weight: parseFloat(weight),
      });

      // Update the selected exercise's sets in state
      setSelectedExercise((prev) => ({
        ...prev,
        sets: prev.sets.map((set) =>
          set.id === setId
            ? { ...set, reps: parseInt(reps), weight: parseFloat(weight) }
            : set,
        ),
      }));

      // Update the exercises list
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === setId
                    ? {
                        ...set,
                        reps: parseInt(reps),
                        weight: parseFloat(weight),
                      }
                    : set,
                ),
              }
            : exercise,
        ),
      );

      setEditingSetId(null);
    } catch (error) {
      console.error("Error updating set:", error);
    }
  };

  const createSet = async (exerciseId, reps, weight) => {
    try {
      // Validate inputs
      if (!reps || !weight) {
        return; // Don't proceed if either field is empty
      }

      // just fetch exercises again
      const newSet = await Sets.create(
        exerciseId,
        parseInt(reps),
        parseFloat(weight),
      );
      if (newSet) {
        // Update the selected exercise's sets in state
        setSelectedExercise((prev) => ({
          ...prev,
          sets: [...(prev.sets || []), newSet],
        }));

        // Update the exercises list to include the new set
        setExercises((prev) =>
          prev.map((exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, sets: [...(exercise.sets || []), newSet] }
              : exercise,
          ),
        );

        // Clear the form inputs
        setReps("");
        setWeight("");
      }
    } catch (error) {
      console.error("Error creating set:", error);
    }
  };

  const handleAddSetKeyPress = (e) => {
    if (e.key === "Enter" && reps && weight) {
      createSet(selectedExercise.id, reps, weight);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900/30 flex items-center justify-center backdrop-blur-sm"
      onClick={closeAddSetModal}
    >
      <div
        className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedExercise.name} Sets</h2>
          <button
            onClick={closeAddSetModal}
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
            onKeyDown={handleAddSetKeyPress}
          />
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            className="border rounded px-2 py-1 w-20"
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={handleAddSetKeyPress}
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
              <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Set
              </th>
              <th className="w-2/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Reps
              </th>
              <th className="w-2/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Weight
              </th>
              <th className="w-1/6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedExercise.sets
              ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((set, index) => (
                <React.Fragment key={set.id}>
                  <tr>
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
                              updateSet(
                                selectedExercise.id,
                                set.id,
                                editSetReps,
                                editSetWeight,
                              );
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
                              updateSet(
                                selectedExercise.id,
                                set.id,
                                editSetReps,
                                editSetWeight,
                              );
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingSet(set)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={16} weight="regular" />
                        </button>
                        <button
                          onClick={() => {
                            if (set.notes) {
                              setExpandedNoteId(expandedNoteId === set.id ? null : set.id);
                            } else {
                              startEditingNote(set);
                            }
                          }}
                          className={`${
                            set.notes
                              ? "text-purple-400 hover:text-purple-600"
                              : "text-gray-400 hover:text-gray-600"
                          } transition-colors`}
                        >
                          <NotePencil size={16} weight="regular" />
                        </button>
                        <button
                          onClick={() => deleteSet(selectedExercise.id, set.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash size={16} weight="regular" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {(expandedNoteId === set.id || editingNoteId === set.id || (set.notes && set.notes !== '')) && (
                    (editingNoteId === set.id || (set.notes && set.notes !== '')) ? (
                      <tr>
                        {editingNoteId === set.id ? (
                          <>
                            <td colSpan={3} className="px-4 py-2 bg-gray-50">
                              <textarea
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                className="w-full border rounded px-2 py-1 min-h-[80px] resize-y"
                                placeholder="Add a note..."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.metaKey) {
                                    updateNote(selectedExercise.id, set.id, editNote);
                                  } else if (e.key === "Escape") {
                                    cancelEditingNote();
                                  }
                                }}
                                autoFocus
                              />
                            </td>
                            <td className="px-4 py-2 bg-gray-50 align-top">
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() =>
                                    updateNote(selectedExercise.id, set.id, editNote)
                                  }
                                  className="text-green-400 hover:text-green-600 transition-colors"
                                >
                                  <Check size={16} weight="regular" />
                                </button>
                                <button
                                  onClick={cancelEditingNote}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <X size={16} weight="regular" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td colSpan={3} className="px-4 py-2 bg-gray-50">
                              <div className="text-sm text-gray-700 whitespace-pre-wrap break-all overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                {set.notes}
                              </div>
                            </td>
                            <td className="px-4 py-2 bg-gray-50 align-top">
                              <button
                                onClick={() => startEditingNote(set)}
                                className="text-blue-400 hover:text-blue-600 transition-colors mt-1"
                                title="Edit note"
                              >
                                <Pencil size={16} weight="regular" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ) : null
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
