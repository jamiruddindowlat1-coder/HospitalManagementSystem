import api from "./api";

const getBeds = async () => {
  const response = await api.get("/Beds");
  return response.data;
};

const getBed = async (id) => {
  const response = await api.get(`/Beds/${id}`);
  return response.data;
};

const createBed = async (bed) => {
  const response = await api.post("/Beds", bed);
  return response.data;
};

const updateBed = async (id, bed) => {
  const response = await api.put(`/Beds/${id}`, {
    bedId: id,
    roomId: bed.roomId,
    bedNumber: bed.bedNumber,
    occupied: bed.occupied,
    cleaningStatus: bed.cleaningStatus,
    status: bed.status,
  });
  return response.data;
};

const deleteBed = async (id) => {
  const response = await api.delete(`/Beds/${id}`);
  return response.data;
};

const bedService = {
  getBeds,
  getBed,
  createBed,
  updateBed,
  deleteBed,
};

export default bedService;
