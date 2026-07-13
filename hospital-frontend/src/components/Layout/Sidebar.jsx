import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaHospital,
  FaPills,
  FaNotesMedical,
  FaClock,
  FaSignOutAlt
} from "react-icons/fa";


export default function Sidebar() {

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    window.location.href = "/login";

  };


  return (
    <aside className="sidebar">

      <div>

        <div className="logo">
          🏥 HMS
        </div>


        <nav>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>


          <NavLink
            to="/patients"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaUserInjured />
            <span>Patients</span>
          </NavLink>


          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaUserMd />
            <span>Doctors</span>
          </NavLink>


          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaCalendarCheck />
            <span>Appointments</span>
          </NavLink>


          <NavLink
            to="/admissions"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaHospital />
            <span>Admissions</span>
          </NavLink>


          <NavLink
            to="/medicines"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaPills />
            <span>Medicines</span>
          </NavLink>


          <NavLink
            to="/records"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaNotesMedical />
            <span>Medical Records</span>
          </NavLink>


          <NavLink
            to="/activity-log"
            className={({ isActive }) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FaClock />
            <span>Activity Log</span>
          </NavLink>


        </nav>


        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <FaSignOutAlt />
          Logout
        </button>


      </div>

    </aside>
  );
}