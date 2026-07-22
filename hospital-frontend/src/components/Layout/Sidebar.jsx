import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaHospital,
  FaBuilding,
  FaPills,
  FaNotesMedical,
  FaClock,
  FaSignOutAlt,
  FaUserCog,
  FaChartBar,
  FaUserNurse,
  FaFlask,
  FaVials,
  FaFileMedicalAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaBed,
  FaXRay,
  FaBoxes,
  FaMobileAlt,
  FaUserClock,
  FaMoneyCheckAlt,
  FaUserShield
} from "react-icons/fa";


export default function Sidebar() {


  const handleLogout = async () => {

    const refreshToken = localStorage.getItem("refreshToken");

    try {

      if(refreshToken){

        await fetch(
          "http://localhost:5151/api/auth/logout",
          {
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              refreshToken
            })
          }
        );

      }

    }
    catch(error){

      console.error("Logout failed",error);

    }
    finally{

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      window.location.href="/login";

    }

  };



  const menuClass = ({isActive}) =>
    isActive ? "menu active" : "menu";



  return (

<aside className="sidebar">


<div className="nav-row">


<div className="nav-group">

<span className="group-label">
Core
</span>


<NavLink to="/" end className={menuClass}>
<FaTachometerAlt/>
<span>Dashboard</span>
</NavLink>


<NavLink to="/departments" className={menuClass}>
<FaBuilding/>
<span>Depts</span>
</NavLink>


</div>




<div className="nav-group">


<span className="group-label">
Patients & Clinical
</span>


<NavLink to="/patients" className={menuClass}>
<FaUserInjured/>
<span>Patients</span>
</NavLink>


<NavLink to="/doctors" className={menuClass}>
<FaUserMd/>
<span>Doctors</span>
</NavLink>


<NavLink to="/appointments" className={menuClass}>
<FaCalendarCheck/>
<span>Appts</span>
</NavLink>


<NavLink to="/admissions" className={menuClass}>
<FaHospital/>
<span>Admissions</span>
</NavLink>


<NavLink to="/medical-records" className={menuClass}>
<FaNotesMedical/>
<span>Records</span>
</NavLink>


</div>




<div className="nav-group">


<span className="group-label">
Nursing & Wards
</span>


<NavLink to="/nurses" className={menuClass}>
<FaUserNurse/>
<span>Nurses</span>
</NavLink>


<NavLink to="/rooms" className={menuClass}>
<FaHospital/>
<span>Rooms</span>
</NavLink>


<NavLink to="/beds" className={menuClass}>
<FaBed/>
<span>Beds</span>
</NavLink>


<NavLink to="/ward-dashboard" className={menuClass}>
<FaBed/>
<span>Ward Board</span>
</NavLink>


<NavLink to="/nurse-assignments" className={menuClass}>
<FaUserNurse/>
<span>Assigns</span>
</NavLink>


<NavLink to="/nursing-notes" className={menuClass}>
<FaNotesMedical/>
<span>Notes</span>
</NavLink>


</div>


</div>





<div className="nav-row">



<div className="nav-group">


<span className="group-label">
Pharmacy & Lab
</span>


<NavLink to="/medicines" className={menuClass}>
<FaPills/>
<span>Meds</span>
</NavLink>


<NavLink to="/pharmacy" className={menuClass}>
<FaPills/>
<span>Pharmacy Board</span>
</NavLink>


<NavLink to="/lab-tests" className={menuClass}>
<FaFileMedicalAlt/>
<span>Tests</span>
</NavLink>


<NavLink to="/lab-results" className={menuClass}>
<FaFlask/>
<span>Results</span>
</NavLink>


<NavLink to="/test-categories" className={menuClass}>
<FaVials/>
<span>Cats</span>
</NavLink>


<NavLink to="/radiology" className={menuClass}>
<FaXRay/>
<span>Radiology</span>
</NavLink>


<NavLink to="/inventory" className={menuClass}>
<FaBoxes/>
<span>Inventory</span>
</NavLink>


</div>





<div className="nav-group">


<span className="group-label">
Accounts
</span>


<NavLink to="/accounts/dashboard" className={menuClass}>
<FaMoneyBillWave/>
<span>Dashboard</span>
</NavLink>


<NavLink to="/accounts/income" className={menuClass}>
<FaMoneyBillWave/>
<span>Income</span>
</NavLink>


<NavLink to="/accounts/expense" className={menuClass}>
<FaMoneyBillWave/>
<span>Expense</span>
</NavLink>


<NavLink to="/accounts/salary" className={menuClass}>
<FaMoneyBillWave/>
<span>Salary</span>
</NavLink>


<NavLink to="/accounts/ledger" className={menuClass}>
<FaMoneyBillWave/>
<span>Ledger</span>
</NavLink>


<NavLink to="/billing" className={menuClass}>
<FaFileInvoiceDollar/>
<span>Billing</span>
</NavLink>


</div>





<div className="nav-group">


<span className="group-label">
Admin
</span>


<NavLink to="/reports" className={menuClass}>
<FaChartBar/>
<span>Reports</span>
</NavLink>


<NavLink to="/financial-reports" className={menuClass}>
<FaFileInvoiceDollar/>
<span>Fin Reports</span>
</NavLink>


<NavLink to="/users" className={menuClass}>
<FaUserCog/>
<span>Users</span>
</NavLink>


<NavLink to="/employees" className={menuClass}>
<FaUserCog/>
<span>Employees</span>
</NavLink>


<NavLink to="/attendance" className={menuClass}>
<FaUserClock/>
<span>Attendance</span>
</NavLink>


<NavLink to="/payroll" className={menuClass}>
<FaMoneyCheckAlt/>
<span>Payroll</span>
</NavLink>


<NavLink to="/leaves" className={menuClass}>
<FaClock/>
<span>Leaves</span>
</NavLink>


<NavLink to="/activity-logs" className={menuClass}>
<FaClock/>
<span>Logs</span>
</NavLink>


<NavLink to="/mobile" className={menuClass}>
<FaMobileAlt/>
<span>Mobile</span>
</NavLink>


<NavLink to="/role-permissions" className={menuClass}>
<FaUserShield/>
<span>Roles</span>
</NavLink>


</div>




<button
onClick={handleLogout}
className="logout-btn"
>

<FaSignOutAlt/>
<span>Logout</span>

</button>



</div>



</aside>

  );

}