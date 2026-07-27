import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt, FaUserInjured, FaUserMd, FaCalendarCheck,
  FaHospital, FaBuilding, FaPills, FaNotesMedical, FaClock,
  FaSignOutAlt, FaUserCog, FaChartBar, FaUserNurse, FaFlask,
  FaFileMedicalAlt, FaMoneyBillWave, FaFileInvoiceDollar,
  FaBed, FaXRay, FaBoxes, FaMobileAlt, FaUserClock,
  FaMoneyCheckAlt, FaUserShield
} from "react-icons/fa";

export default function Sidebar() {
  const userRole = localStorage.getItem("role") || "";
  const userName = localStorage.getItem("user") || userRole || "User";
  const hasRole = (...roles) => roles.includes(userRole) || userRole === "Admin";

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await fetch("http://localhost:5151/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const menuClass = ({ isActive }) => isActive ? "menu active" : "menu";

  return (
    <aside className="sidebar">

      {/* ── Scrollable nav ── */}
      <div className="sidebar-nav">

        {/* Core */}
        <div className="nav-group">
          <span className="group-label">Core</span>
          <NavLink to="/" end className={menuClass}>
            <FaTachometerAlt /><span>Dashboard</span>
          </NavLink>
          {hasRole("Receptionist") && (
            <NavLink to="/departments" className={menuClass}>
              <FaBuilding /><span>Depts</span>
            </NavLink>
          )}
        </div>

        {/* Patients & Clinical */}
        {hasRole("Doctor","Nurse","Receptionist","Patient") && (
          <div className="nav-group">
            <span className="group-label">Patients & Clinical</span>
            {hasRole("Doctor","Nurse","Receptionist") && (
              <NavLink to="/patients" className={menuClass}>
                <FaUserInjured /><span>Patients</span>
              </NavLink>
            )}
            {hasRole("Receptionist","Patient") && (
              <NavLink to="/doctors" className={menuClass}>
                <FaUserMd /><span>Doctors</span>
              </NavLink>
            )}
            {hasRole("Doctor","Receptionist","Patient") && (
              <NavLink to="/appointments" className={menuClass}>
                <FaCalendarCheck /><span>Appts</span>
              </NavLink>
            )}
            {hasRole("Nurse","Receptionist","Patient") && (
              <NavLink to="/admissions" className={menuClass}>
                <FaHospital /><span>Admissions</span>
              </NavLink>
            )}
            {hasRole("Doctor","Nurse","Patient") && (
              <NavLink to="/medical-records" className={menuClass}>
                <FaNotesMedical /><span>Records</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Nursing & Wards */}
        {hasRole("Doctor","Nurse","Receptionist") && (
          <div className="nav-group">
            <span className="group-label">Nursing & Wards</span>
            {hasRole("Receptionist") && (
              <NavLink to="/nurses" className={menuClass}>
                <FaUserNurse /><span>Nurses</span>
              </NavLink>
            )}
            {hasRole("Nurse","Receptionist") && (
              <>
                <NavLink to="/rooms" className={menuClass}>
                  <FaHospital /><span>Rooms</span>
                </NavLink>
                <NavLink to="/beds" className={menuClass}>
                  <FaBed /><span>Beds</span>
                </NavLink>
              </>
            )}
            {hasRole("Nurse","Doctor") && (
              <NavLink to="/ward-dashboard" className={menuClass}>
                <FaBed /><span>Ward Board</span>
              </NavLink>
            )}
            {hasRole("Nurse") && (
              <NavLink to="/nurse-assignments" className={menuClass}>
                <FaUserNurse /><span>Assigns</span>
              </NavLink>
            )}
            {hasRole("Nurse","Doctor") && (
              <NavLink to="/nursing-notes" className={menuClass}>
                <FaNotesMedical /><span>Notes</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Pharmacy & Lab */}
        {hasRole("Doctor","Nurse","Patient") && (
          <div className="nav-group">
            <span className="group-label">Pharmacy & Lab</span>
            {hasRole("Doctor","Nurse") && (
              <NavLink to="/medicines" className={menuClass}>
                <FaPills /><span>Meds</span>
              </NavLink>
            )}
            {hasRole("Doctor","Nurse") && (
              <NavLink to="/lab-tests" className={menuClass}>
                <FaFileMedicalAlt /><span>Tests</span>
              </NavLink>
            )}
            {hasRole("Doctor","Nurse","Patient") && (
              <NavLink to="/lab-results" className={menuClass}>
                <FaFlask /><span>Results</span>
              </NavLink>
            )}
            {hasRole("Doctor") && (
              <NavLink to="/radiology" className={menuClass}>
                <FaXRay /><span>Radiology</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Accounts */}
        {hasRole("Receptionist","Patient") && (
          <div className="nav-group">
            <span className="group-label">Accounts</span>
            <NavLink to="/accounts/dashboard" className={menuClass}>
              <FaMoneyBillWave /><span>Dashboard</span>
            </NavLink>
            <NavLink to="/accounts/income" className={menuClass}>
              <FaMoneyBillWave /><span>Income</span>
            </NavLink>
            <NavLink to="/accounts/expense" className={menuClass}>
              <FaMoneyBillWave /><span>Expense</span>
            </NavLink>
            <NavLink to="/accounts/salary" className={menuClass}>
              <FaMoneyBillWave /><span>Salary</span>
            </NavLink>
            <NavLink to="/accounts/ledger" className={menuClass}>
              <FaMoneyBillWave /><span>Ledger</span>
            </NavLink>
            <NavLink to="/billing" className={menuClass}>
              <FaFileInvoiceDollar /><span>Billing</span>
            </NavLink>
          </div>
        )}

        {/* Admin */}
        {hasRole() && (
          <div className="nav-group">
            <span className="group-label">Admin</span>
            <NavLink to="/reports" className={menuClass}>
              <FaChartBar /><span>Reports</span>
            </NavLink>
            <NavLink to="/financial-reports" className={menuClass}>
              <FaFileInvoiceDollar /><span>Fin Reports</span>
            </NavLink>
            <NavLink to="/users" className={menuClass}>
              <FaUserCog /><span>Users</span>
            </NavLink>
            <NavLink to="/employees" className={menuClass}>
              <FaUserCog /><span>Employees</span>
            </NavLink>
            <NavLink to="/attendance" className={menuClass}>
              <FaUserClock /><span>Attendance</span>
            </NavLink>
            <NavLink to="/payroll" className={menuClass}>
              <FaMoneyCheckAlt /><span>Payroll</span>
            </NavLink>
            <NavLink to="/leaves" className={menuClass}>
              <FaClock /><span>Leaves</span>
            </NavLink>
            <NavLink to="/activity-logs" className={menuClass}>
              <FaClock /><span>Logs</span>
            </NavLink>
            <NavLink to="/mobile" className={menuClass}>
              <FaMobileAlt /><span>Mobile</span>
            </NavLink>
            <NavLink to="/role-permissions" className={menuClass}>
              <FaUserShield /><span>Roles</span>
            </NavLink>
          </div>
        )}

      </div>

      {/* ── Logout সবসময় নিচে ── */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /><span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
