import api from "./api";

const getRooms = async () => {
  const response = await api.get("/Rooms");
  return response.data;
};

const getRoom = async (id) => {
  const response = await api.get(`/Rooms/${id}`);
  return response.data;
};

const createRoom = async (room) => {
  const response = await api.post("/Rooms", room);
  return response.data;
};

const updateRoom = async (id, room) => {
  const response = await api.put(`/Rooms/${id}`, {
    roomId: id,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    isOccupied: room.isOccupied,
    pricePerDay: room.pricePerDay,
    floor: room.floor,
    status: room.status,
    departmentId: room.departmentId,
  });
  return response.data;
};

const deleteRoom = async (id) => {
  const response = await api.delete(`/Rooms/${id}`);
  return response.data;
};

const roomService = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
