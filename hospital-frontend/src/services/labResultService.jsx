import api from "./api";


export const getLabResults = async () => {

    const response = await api.get("/LabResults");

    return response.data;

};



export const createLabResult = async (labResult) => {

    const response = await api.post(
        "/LabResults",
        labResult
    );

    return response.data;

};



export const updateLabResult = async (id, labResult) => {

    const response = await api.put(
        `/LabResults/${id}`,
        labResult
    );

    return response.data;

};



export const deleteLabResult = async (id) => {

    const response = await api.delete(
        `/LabResults/${id}`
    );

    return response.data;

};