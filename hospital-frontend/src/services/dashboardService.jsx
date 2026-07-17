import axios from "axios";

const API_URL = "http://localhost:5151/api/Dashboard";
const ACTIVITY_LOG_URL = "http://localhost:5151/api/ActivityLogs";

export const getDashboardSummary = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getMonthlyRevenue = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/monthly-revenue`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getPatientGrowth = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/patient-growth`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getDoctorsByDepartment = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/doctors-by-department`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getMedicineStock = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/medicine-stock`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getRoomOccupancy = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${API_URL}/room-occupancy`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getRecentActivities = async (count = 10) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${ACTIVITY_LOG_URL}/recent?count=${count}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getActivityLogs = async ({ page = 1, pageSize = 20, entity = "", action = "", search = "" } = {}) => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page, pageSize });
    if (entity) params.append("entity", entity);
    if (action) params.append("action", action);
    if (search) params.append("search", search);
    const response = await axios.get(
        `${ACTIVITY_LOG_URL}?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getActivityLogEntities = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${ACTIVITY_LOG_URL}/entities`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};