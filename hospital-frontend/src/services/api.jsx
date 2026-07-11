import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({

  baseURL: "http://localhost:5151/api",

  headers:{
    "Content-Type":"application/json",
  },

});


api.interceptors.request.use(

(config)=>{

const token = getToken();


if(token){

config.headers.Authorization =
`Bearer ${token}`;

}


console.log(
"API:",
config.method?.toUpperCase(),
config.url
);


return config;

},

(error)=>Promise.reject(error)

);



api.interceptors.response.use(

(response)=>response,

(error)=>{


console.error(
"Status:",
error.response?.status
);


console.error(
"Response:",
error.response?.data
);



if(error.response?.status===401){

console.warn(
"Token expired"
);

}


return Promise.reject(error);


}

);



export default api;