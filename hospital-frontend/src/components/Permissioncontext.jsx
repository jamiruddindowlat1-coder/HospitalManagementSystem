import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.jsx";


const PermissionContext = createContext();


export function PermissionProvider({children}){


    const [permissions,setPermissions] = useState({});
    const [loading,setLoading] = useState(true);



    useEffect(()=>{

        const token = localStorage.getItem("token");

        if(token){
            loadPermissions();
        } else {
            setLoading(false);
        }

    },[]);



    const loadPermissions = async()=>{

        try{

            const res = await api.get(
                "/RolePermissions/my-permissions"
            );


            const data={};


            res.data.forEach(item=>{

                data[item.moduleName] = item.hasAccess;

            });



            setPermissions(data);


            console.log(
                "PERMISSIONS:",
                data
            );


        }
        catch(error){

            console.log(
                "Permission load error",
                error
            );

            setPermissions({});

        }
        finally{

            setLoading(false);

        }

    };




    const hasAccessForPath=(path)=>{


        const map={


            "/": "Dashboard",

            "/patients":"Patients",

            "/doctors":"Doctors",

            "/appointments":"Appointments",

            "/admissions":"Admissions",

            "/medical-records":"Medical Records",

            "/nurses":"Nurses",

            "/rooms":"Rooms",

            "/beds":"Beds",

            "/billing":"Billing",

            "/accounts/dashboard":"Accounts Dashboard",

            "/accounts/income":"Income",

            "/accounts/expense":"Expense",

            "/accounts/salary":"Salary",

            "/accounts/ledger":"Ledger",

            "/reports":"Reports",

            "/lab-tests":"Lab Tests",

            "/lab-results":"Lab Results",

            "/inventory":"Inventory",

            "/medicines":"Medicines",

            "/pharmacy":"Pharmacy Board",

            "/radiology":"Radiology",

            "/users":"Users",

            "/employees":"Employees",

            "/attendance":"Attendance",

            "/payroll":"Payroll",

            "/activity-logs":"Activity Logs"

        };



        const module = map[path];


        if(!module)
            return true;



        return permissions[module] === true;


    };





    return (

        <PermissionContext.Provider

        value={{

            permissions,

            loading,

            hasAccessForPath

        }}

        >

        {children}

        </PermissionContext.Provider>

    );


}




export function usePermissions(){

    return useContext(PermissionContext);

}