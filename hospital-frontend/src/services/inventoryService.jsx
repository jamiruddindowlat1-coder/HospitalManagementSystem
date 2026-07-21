import api from "./api";

export const getInventoryItems = async () => {
    const response = await api.get("/Inventory");
    return response.data;
};

export const getInventoryItemById = async (id) => {
    const response = await api.get(`/Inventory/${id}`);
    return response.data;
};

export const getLowStockItems = async () => {
    const response = await api.get("/Inventory/low-stock");
    return response.data;
};

export const createInventoryItem = async (data) => {
    const response = await api.post("/Inventory", data);
    return response.data;
};

export const updateInventoryItem = async (id, data) => {
    const response = await api.put(`/Inventory/${id}`, data);
    return response.data;
};

export const adjustStock = async (id, adjustment) => {
    const response = await api.patch(`/Inventory/${id}/adjust-stock`, adjustment);
    return response.data;
};

export const deleteInventoryItem = async (id) => {
    const response = await api.delete(`/Inventory/${id}`);
    return response.data;
};
