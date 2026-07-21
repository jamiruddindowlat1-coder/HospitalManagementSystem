import api from "./api";

const getAssignments = async () => {
  const response = await api.get("/NurseAssignments");
  return response.data;
};

const createAssignment = async (assignment) => {
  const response = await api.post("/NurseAssignments", assignment);
  return response.data;
};

const updateAssignment = async (id, assignment) => {
  const response = await api.put(`/NurseAssignments/${id}`, {
    nurseAssignmentId: id,
    nurseId: assignment.nurseId,
    patientId: assignment.patientId,
    releaseDate: assignment.releaseDate,
  });
  return response.data;
};

const deleteAssignment = async (id) => {
  const response = await api.delete(`/NurseAssignments/${id}`);
  return response.data;
};

const nurseAssignmentService = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};

export default nurseAssignmentService;
