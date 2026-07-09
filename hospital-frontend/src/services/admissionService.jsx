import api from "./api";


export const getAdmissions = async()=>{

    const response = await api.get("/Admissions");

    return response.data;

};