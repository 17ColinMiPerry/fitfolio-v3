import { API_BASE } from "../utils/constants";

const Sets = {
  all: async () => {
    return await fetch(`${API_BASE}/sets`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res?.sets || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  create: async (set) => {
    return await fetch(`${API_BASE}/sets`, {
      method: "POST",
      body: JSON.stringify(set),
    });
  }, 
  delete: async (id) => {
    return await fetch(`${API_BASE}/sets/${id}`, {
      method: "DELETE",
    });
  },
  update: async (id, set) => {
    return await fetch(`${API_BASE}/sets/${id}`, {
      method: "PUT",
      body: JSON.stringify(set),
    });
  },

  
  
};

export default Sets;
