import api from "./api";

// GET ALL NURSES
const getAllNurses = async () => {
  const response = await api.get("/Nurse");
  return response.data;
};

// CREATE NURSE
const createNurse = async (nurse) => {
  const response = await api.post("/Nurse", nurse);
  return response.data;
};

// UPDATE NURSE
const updateNurse = async (id, nurse) => {
  const response = await api.put(`/Nurse/${id}`, {
    nurseId: id,
    fullName: nurse.fullName,
    phone: nurse.phone,
    shift: nurse.shift,
    departmentId: nurse.departmentId,
  });
  return response.data;
};

// DELETE NURSE
const deleteNurse = async (id) => {
  const response = await api.delete(`/Nurse/${id}`);
  return response.data;
};

const nurseService = {
  getAllNurses,
  createNurse,
  updateNurse,
  deleteNurse,
};

export default nurseService;