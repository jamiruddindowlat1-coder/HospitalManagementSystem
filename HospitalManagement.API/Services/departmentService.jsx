import api from "./api";


// GET ALL
export const getDepartments = async () => {
    const res = await api.get("/departments");
    return res.data;
};


// GET BY ID
export const getDepartmentById = async (id) => {
    const res = await api.get(`/departments/${id}`);
    return res.data;
};


// CREATE
export const createDepartment = async (data) => {
    const res = await api.post("/departments", data);
    return res.data;
};


// UPDATE
export const updateDepartment = async (id, data) => {
    const res = await api.put(`/departments/${id}`, data);
    return res.data;
};


// DELETE
export const deleteDepartment = async (id) => {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
};