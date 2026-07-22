import api from "./api";

const payrollService = {
  getAll: () => api.get("/Payrolls"),
  getById: (id) => api.get(`/Payrolls/${id}`),
  create: (data) => api.post("/Payrolls", data),
  markAsPaid: (id) => api.put(`/Payrolls/${id}/mark-paid`),
  delete: (id) => api.delete(`/Payrolls/${id}`)
};

export default payrollService;