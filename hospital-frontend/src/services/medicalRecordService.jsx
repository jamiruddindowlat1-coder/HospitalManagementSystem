import api from "./api";


export const getMedicalRecords = async()=>{

    const response = await api.get("/MedicalRecords");

    return response.data;

};