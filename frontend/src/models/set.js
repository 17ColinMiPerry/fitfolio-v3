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
};

export default Sets;
