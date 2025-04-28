import { useEffect, useState } from "react";
import Exercises from "../../../models/exercise";

export default function CurrentWorkout() {
  const [exercises, setExercises] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const deleteExercise = async (id) => {
    await Exercises.delete(id);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
  };

  const createExercise = async (name) => {
    await Exercises.create(name);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
  };

  const updateExercise = async (id, name) => {
    await Exercises.update(id, name);
    const updatedExercises = await Exercises.all();
    setExercises(updatedExercises);
    setEditingId(null);
  };

  const startEditing = (exercise) => {
    setEditingId(exercise.id);
    setEditName(exercise.name);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exercise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exercises.map((exercise) => (
              <tr key={exercise.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === exercise.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateExercise(exercise.id, editName);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {exercise.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(exercise.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === exercise.id ? (
                    <button
                      onClick={() => updateExercise(exercise.id, editName)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(exercise)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <button
          onClick={() => createExercise("New Exercise")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </div>
    </div>
  );
}
