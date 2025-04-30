import { API_BASE } from "../utils/constants";

const Sets = {
  all: async (exerciseId) => {
    return await fetch(`${API_BASE}/exercises/${exerciseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res?.sets || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  create: async (exerciseId, reps, weight) => {
    return await fetch(`${API_BASE}/exercises/${exerciseId}/sets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reps: parseInt(reps),
        weight: parseFloat(weight),
      }),
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  delete: async (exerciseId, setId) => {
    return await fetch(`${API_BASE}/exercises/${exerciseId}/sets/${setId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  update: async (exerciseId, setId, { reps, weight }) => {
    return await fetch(`${API_BASE}/exercises/${exerciseId}/sets/${setId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reps: parseInt(reps),
        weight: parseFloat(weight),
      }),
    })
      .then((res) => res.json())
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
};

export default Sets;
