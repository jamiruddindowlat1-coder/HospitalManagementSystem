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
  FaBoxes
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
          Hospital HMS
        </div>


        <nav>


          {/* Dashboard */}
          <NavLink to="/" end className={menuClass}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>


          {/* Hospital Management */}

          <NavLink to="/patients" className={menuClass}>
            <FaUserInjured />
            <span>Patients</span>
          </NavLink>


          <NavLink to="/doctors" className={menuClass}>
            <FaUserMd />
            <span>Doctors</span>
          </NavLink>


          <NavLink to="/appointments" className={menuClass}>
            <FaCalendarCheck />
            <span>Appointments</span>
          </NavLink>


          <NavLink to="/admissions" className={menuClass}>
            <FaHospital />
            <span>Admissions</span>
          </NavLink>


          <NavLink to="/departments" className={menuClass}>
            <FaBuilding />
            <span>Departments</span>
          </NavLink>


          <NavLink to="/medicines" className={menuClass}>
            <FaPills />
            <span>Medicines</span>
          </NavLink>



          {/* Laboratory */}

          <NavLink to="/lab-tests" className={menuClass}>
            <FaFileMedicalAlt />
            <span>Lab Tests</span>
          </NavLink>


          <NavLink to="/lab-results" className={menuClass}>
            <FaFlask />
            <span>Lab Results</span>
          </NavLink>


          <NavLink to="/test-categories" className={menuClass}>
            <FaVials />
            <span>Test Categories</span>
          </NavLink>


          {/* Radiology */}

          <NavLink to="/radiology" className={menuClass}>
            <FaXRay />
            <span>Radiology Tests</span>
          </NavLink>


          {/* Inventory */}

          <NavLink to="/inventory" className={menuClass}>
            <FaBoxes />
            <span>Inventory</span>
          </NavLink>



          {/* Medical */}

          <NavLink to="/medical-records" className={menuClass}>
            <FaNotesMedical />
            <span>Medical Records</span>
          </NavLink>


          <NavLink to="/nurses" className={menuClass}>
            <FaUserNurse />
            <span>Nurses</span>
          </NavLink>

          <NavLink to="/rooms" className={menuClass}>
            <FaHospital />
            <span>Rooms</span>
          </NavLink>

          <NavLink to="/beds" className={menuClass}>
            <FaBed />
            <span>Beds</span>
          </NavLink>

          <NavLink to="/nurse-assignments" className={menuClass}>
            <FaUserNurse />
            <span>Nurse Assignments</span>
          </NavLink>

          <NavLink to="/nursing-notes" className={menuClass}>
            <FaNotesMedical />
            <span>Nursing Notes</span>
          </NavLink>



          {/* Accounts */}

          <NavLink to="/accounts/dashboard" className={menuClass}>
            <FaMoneyBillWave />
            <span>Accounts Dashboard</span>
          </NavLink>


          <NavLink to="/accounts/income" className={menuClass}>
            <FaMoneyBillWave />
            <span>Income</span>
          </NavLink>


          <NavLink to="/accounts/expense" className={menuClass}>
            <FaMoneyBillWave />
            <span>Expense</span>
          </NavLink>


          <NavLink to="/accounts/salary" className={menuClass}>
            <FaMoneyBillWave />
            <span>Salary Payments</span>
          </NavLink>


          <NavLink to="/accounts/ledger" className={menuClass}>
            <FaMoneyBillWave />
            <span>Ledger</span>
          </NavLink>



          {/* Reports */}

          <NavLink to="/reports" className={menuClass}>
            <FaChartBar />
            <span>Reports</span>
          </NavLink>


          <NavLink to="/financial-reports" className={menuClass}>
            <FaFileInvoiceDollar />
            <span>Financial Reports</span>
          </NavLink>



          {/* Admin */}

          <NavLink to="/users" className={menuClass}>
            <FaUserCog />
            <span>User Management</span>
          </NavLink>


          <NavLink to="/activity-logs" className={menuClass}>
            <FaClock />
            <span>Activity Log</span>
          </NavLink>



          {/* Logout */}

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