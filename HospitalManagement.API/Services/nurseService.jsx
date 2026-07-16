import axios from "axios";

const API_URL = "http://localhost:5151/api/Nurse";

const getToken = () => {
  return localStorage.getItem("hms_jwt_token") || localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const getAllNurses = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

const getNurseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeader());
  return response.data;
};

const createNurse = async (nurseData) => {
  const response = await axios.post(API_URL, nurseData, authHeader());
  return response.data;
};

const updateNurse = async (id, nurseData) => {
  const response = await axios.put(`${API_URL}/${id}`, nurseData, authHeader());
  return response.data;
};

const deleteNurse = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader());
  return response.data;
};

const nurseService = {
  getAllNurses,
  getNurseById,
  createNurse,
  updateNurse,
  deleteNurse,
};

export default nurseService;