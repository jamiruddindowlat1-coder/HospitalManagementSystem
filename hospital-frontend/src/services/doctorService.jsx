import api from "./api";


export const getDoctors = async()=>{

    const response = await api.get("/Doctors");

    return response.data;

};