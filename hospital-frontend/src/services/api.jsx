import axios from "axios";
import { getToken } from "./auth";


const API_BASE_URL = "http://localhost:5151/api";


const api = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }

});


// JWT Token Add Automatically

api.interceptors.request.use(

    (config) => {

        const token = getToken();


        if (token) {

            config.headers = config.headers || {};

            config.headers.Authorization = 
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


export default api;