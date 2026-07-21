import api from "./api";

export const getAllTestCategories = async () => {
    const response = await api.get("/testcategories");
    return response.data;
};

export const getTestCategoryById = async (id) => {
    const response = await api.get(`/testcategories/${id}`);
    return response.data;
};

export const createTestCategory = async (data) => {
    const response = await api.post("/testcategories", data);
    return response.data;
};

export const updateTestCategory = async (id, data) => {
    const response = await api.put(`/testcategories/${id}`, data);
    return response.data;
};

export const deleteTestCategory = async (id) => {
    const response = await api.delete(`/testcategories/${id}`);
    return response.data;
};