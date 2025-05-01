import { API_BASE } from "../utils/constants";

const Workouts = {
  all: async (userId) => {
    return await fetch(`${API_BASE}/workouts`, {
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
  create: async (userId, name) => {
    try {
      const response = await fetch(`${API_BASE}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating workout:', errorData);
        throw new Error(errorData.error || 'Failed to create workout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in workout creation:', error);
      throw error; // Re-throw to handle in the component
    }
  },
  delete: async (userId, id) => {
    return await fetch(`${API_BASE}/workouts/${id}`, {
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
    return await fetch(`${API_BASE}/workouts/${id}`, {
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

export default Workouts;
