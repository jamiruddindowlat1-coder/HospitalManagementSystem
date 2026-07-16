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
  FaUserNurse
} from "react-icons/fa";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const menuClass = ({ isActive }) =>
    isActive ? "menu active" : "menu";

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
            className={menuClass}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/patients"
            className={menuClass}
          >
            <FaUserInjured />
            <span>Patients</span>
          </NavLink>

          <NavLink
            to="/doctors"
            className={menuClass}
          >
            <FaUserMd />
            <span>Doctors</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={menuClass}
          >
            <FaCalendarCheck />
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/admissions"
            className={menuClass}
          >
            <FaHospital />
            <span>Admissions</span>
          </NavLink>

          {/* Department Added */}
          <NavLink
            to="/departments"
            className={menuClass}
          >
            <FaBuilding />
            <span>Departments</span>
          </NavLink>

          <NavLink
            to="/medicines"
            className={menuClass}
          >
            <FaPills />
            <span>Medicines</span>
          </NavLink>

          <NavLink
            to="/medical-records"
            className={menuClass}
          >
            <FaNotesMedical />
            <span>Medical Records</span>
          </NavLink>

          <NavLink
            to="/nurses"
            className={menuClass}
          >
            <FaUserNurse />
            <span>Nurses</span>
          </NavLink>

          <NavLink
            to="/reports"
            className={menuClass}
          >
            <FaChartBar />
            <span>Reports</span>
          </NavLink>

          <NavLink
            to="/users"
            className={menuClass}
          >
            <FaUserCog />
            <span>User Management</span>
          </NavLink>

          <NavLink
            to="/activity-logs"
            className={menuClass}
          >
            <FaClock />
            <span>Activity Log</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="menu logout-btn"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
