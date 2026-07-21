import api from "./api";

export const getRadiologyTests = async () => {
    const response = await api.get("/RadiologyTests");
    return response.data;
};

export const getRadiologyTestById = async (id) => {
    const response = await api.get(`/RadiologyTests/${id}`);
    return response.data;
};

export const createRadiologyTest = async (data) => {
    const response = await api.post("/RadiologyTests", data);
    return response.data;
};

export const updateRadiologyTest = async (id, data) => {
    const response = await api.put(`/RadiologyTests/${id}`, data);
    return response.data;
};

export const deleteRadiologyTest = async (id) => {
    const response = await api.delete(`/RadiologyTests/${id}`);
    return response.data;
};
