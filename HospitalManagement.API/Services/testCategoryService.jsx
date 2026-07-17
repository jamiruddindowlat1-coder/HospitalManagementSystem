import axios from "axios";

const API_URL = "http://localhost:5151/api/testcategories";

const getToken = () => localStorage.getItem("hms_jwt_token");

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getAllTestCategories = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

export const getTestCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeader());
  return response.data;
};

export const createTestCategory = async (data) => {
  const response = await axios.post(API_URL, data, authHeader());
  return response.data;
};

export const updateTestCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, authHeader());
  return response.data;
};

export const deleteTestCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader());
  return response.data;
};