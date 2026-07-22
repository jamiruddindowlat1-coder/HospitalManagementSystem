import api from "./api";

export const getDashboardSummary = async () => {
    const response = await api.get("/Dashboard/summary");
    return response.data;
};

export const getMonthlyRevenue = async () => {
    const response = await api.get("/Dashboard/monthly-revenue");
    return response.data;
};

export const getPatientGrowth = async () => {
    const response = await api.get("/Dashboard/patient-growth");
    return response.data;
};

export const getDoctorsByDepartment = async () => {
    const response = await api.get("/Dashboard/doctors-by-department");
    return response.data;
};

export const getMedicineStock = async () => {
    const response = await api.get("/Dashboard/medicine-stock");
    return response.data;
};

export const getRoomOccupancy = async () => {
    const response = await api.get("/Dashboard/room-occupancy");
    return response.data;
};

export const getRecentActivities = async (count = 10) => {
    const response = await api.get(`/ActivityLogs/recent?count=${count}`);
    return response.data;
};

export const getActivityLogs = async ({ page = 1, pageSize = 20, entity = "", action = "", search = "" } = {}) => {
    const params = new URLSearchParams({ page, pageSize });
    if (entity) params.append("entity", entity);
    if (action) params.append("action", action);
    if (search) params.append("search", search);
    const response = await api.get(`/ActivityLogs?${params.toString()}`);
    return response.data;
};

export const getActivityLogEntities = async () => {
    const response = await api.get("/ActivityLogs/entities");
    return response.data;
};