import api from "./api";


// Get All Medicines
export const getMedicines = async () => {

    const response = await api.get("/Medicines");

    return response.data;

};



// Get Medicine By Id
export const getMedicineById = async (id) => {

    const response = await api.get(`/Medicines/${id}`);

    return response.data;

};



// Create Medicine
export const createMedicine = async (medicine) => {

    const response = await api.post(
        "/Medicines",
        medicine
    );

    return response.data;

};



// Update Medicine
export const updateMedicine = async (id, medicine) => {

    const response = await api.put(
        `/Medicines/${id}`,
        medicine
    );

    return response.data;

};



// Delete Medicine
export const deleteMedicine = async (id) => {

    const response = await api.delete(
        `/Medicines/${id}`
    );

    return response.data;

};