import api from "./api";


export const getAppointments = async () => {

    const response = await api.get("/Appointments");

    return response.data;

};



export const createAppointment = async (data) => {

    const response = await api.post(
        "/Appointments",
        data
    );

    return response.data;

};



export const updateAppointment = async (id, data) => {

    const response = await api.put(
        `/Appointments/${id}`,
        data
    );

    return response.data;

};



export const deleteAppointment = async (id) => {

    const response = await api.delete(
        `/Appointments/${id}`
    );

    return response.data;

};