import { API_BASE } from "../utils/constants";

const Exercises = {
  all: async () => {
    return await fetch(`${API_BASE}/exercises`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  create: async (name) => {
    return await fetch(`${API_BASE}/exercises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  delete: async (id) => {
    return await fetch(`${API_BASE}/exercises/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => res?.exercise || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  update: async (id, name) => {
    return await fetch(`${API_BASE}/exercises/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((res) => res?.exercise || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
};

export default Exercises;
