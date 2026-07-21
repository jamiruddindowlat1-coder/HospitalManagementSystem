import api from "./api";

const getNotes = async () => {
  const response = await api.get("/NursingNotes");
  return response.data;
};

const createNote = async (note) => {
  const response = await api.post("/NursingNotes", note);
  return response.data;
};

const updateNote = async (id, note) => {
  const response = await api.put(`/NursingNotes/${id}`, {
    nursingNoteId: id,
    patientId: note.patientId,
    nurseId: note.nurseId,
    temperature: parseFloat(note.temperature),
    pulse: parseInt(note.pulse),
    bloodPressure: note.bloodPressure,
    respiration: parseInt(note.respiration),
    oxygen: parseFloat(note.oxygen),
    weight: parseFloat(note.weight),
    medicine: note.medicine,
    observation: note.observation,
    remark: note.remark,
  });
  return response.data;
};

const deleteNote = async (id) => {
  const response = await api.delete(`/NursingNotes/${id}`);
  return response.data;
};

const nursingNoteService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};

export default nursingNoteService;
