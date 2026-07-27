import { useLocation } from "react-router-dom";
import { usePermissions } from "./PermissionContext.jsx";


export default function PermissionRoute({ children }) {


    const location = useLocation();


    const {
        loading,
        permissions,
        hasAccessForPath
    } = usePermissions();



    const role =
    (localStorage.getItem("role") || "").toLowerCase();




    // Admin full access
    if(role === "admin"){
        return children;
    }


    // Doctor & Nurse - permission system নেই, সরাসরি access
    if(role === "doctor" || role === "nurse"){
        return children;
    }


    // Permission loading
    if(loading || permissions === null){

        return (
            <div
            style={{
                padding:"40px",
                textAlign:"center",
                fontSize:"18px"
            }}
            >
                Loading permissions...
            </div>
        );

    }


    // Permission API fail হলে access দাও (block করবে না)
    if(
        !permissions ||
        Object.keys(permissions).length === 0
    ){
        return children;
    }


    const path = location.pathname;

    const allowed = hasAccessForPath(path);


    console.log(
        "PERMISSION CHECK:",
        path,
        allowed,
        permissions
    );


    if(allowed !== true){

        return (
            <div
            style={{
                padding:"50px",
                textAlign:"center"
            }}
            >
                <h2 style={{color:"#dc2626"}}>
                    Access Denied
                </h2>
                <p>
                    You don't have permission to view this module.
                </p>
            </div>
        );

    }


    return children;


}