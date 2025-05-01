import { API_BASE } from "../utils/constants";

const Exercises = {
  all: async (userId, workoutId) => {
    return await fetch(`${API_BASE}/exercises?workoutId=${workoutId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
    })
      .then((res) => res.json())
      .then((res) => res || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  create: async (userId, workoutId, name) => {
    return await fetch(`${API_BASE}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ workoutId, name }),
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  delete: async (userId, id) => {
    return await fetch(`${API_BASE}/exercises/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  update: async (userId, id, name) => {
    return await fetch(`${API_BASE}/exercises/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
};

export default Exercises;
