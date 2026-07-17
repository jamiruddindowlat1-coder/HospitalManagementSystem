import api from "./api";


export const getLabTests = async () => {

    const response = await api.get("/LabTest");

    return response.data;

};



export const createLabTest = async (labTest) => {

    const response = await api.post(
        "/LabTest",
        labTest
    );

    return response.data;

};



export const updateLabTest = async (id, labTest) => {

    const response = await api.put(
        `/LabTest/${id}`,
        labTest
    );

    return response.data;

};



export const deleteLabTest = async (id) => {

    const response = await api.delete(
        `/LabTest/${id}`
    );

    return response.data;

};