import api from "./api";

const employeeService = {
  getAll: async () => {
    const res = await api.get("/Employees");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/Employees/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/Employees", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/Employees/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/Employees/${id}`);
    return res.data;
  },
};

export default employeeService;
