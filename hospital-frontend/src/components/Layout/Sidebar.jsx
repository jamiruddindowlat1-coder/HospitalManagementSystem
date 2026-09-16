import { NavLink } from "react-router-dom";
import { usePermissions } from "../PermissionContext.jsx";

import {
  FaTachometerAlt, FaUserInjured, FaUserMd, FaCalendarCheck,
  FaHospital, FaBuilding, FaPills, FaNotesMedical, FaClock,
  FaSignOutAlt, FaUserCog, FaChartBar, FaUserNurse, FaFlask,
  FaFileMedicalAlt, FaMoneyBillWave, FaFileInvoiceDollar,
  FaBed, FaXRay, FaBoxes, FaMobileAlt, FaUserClock,
  FaMoneyCheckAlt, FaUserShield
} from "react-icons/fa";

export default function Sidebar() {
  const { hasAccessForPath, loading } = usePermissions();

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

  // Permission load হওয়ার আগে sidebar দেখাবে না
  if (loading) {
    return (
      <aside className="sidebar">
        <div style={{ padding: "20px 10px", color: "#475569", fontSize: "12px" }}>
          Loading...
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">

      {/* ── Scrollable nav ── */}
      <div className="sidebar-nav">

        {/* Core */}
        <div className="nav-group">
          <span className="group-label">Core</span>
          {hasAccessForPath("/") && (
            <NavLink to="/" end className={menuClass}>
              <FaTachometerAlt /><span>Dashboard</span>
            </NavLink>
          )}
        </div>

        {/* Patients & Clinical */}
        {(
          hasAccessForPath("/patients") ||
          hasAccessForPath("/doctors") ||
          hasAccessForPath("/appointments") ||
          hasAccessForPath("/admissions") ||
          hasAccessForPath("/medical-records")
        ) && (
          <div className="nav-group">
            <span className="group-label">Patients & Clinical</span>
            {hasAccessForPath("/patients") && (
              <NavLink to="/patients" className={menuClass}>
                <FaUserInjured /><span>Patients</span>
              </NavLink>
            )}
            {hasAccessForPath("/doctors") && (
              <NavLink to="/doctors" className={menuClass}>
                <FaUserMd /><span>Doctors</span>
              </NavLink>
            )}
            {hasAccessForPath("/appointments") && (
              <NavLink to="/appointments" className={menuClass}>
                <FaCalendarCheck /><span>Appts</span>
              </NavLink>
            )}
            {hasAccessForPath("/admissions") && (
              <NavLink to="/admissions" className={menuClass}>
                <FaHospital /><span>Admissions</span>
              </NavLink>
            )}
            {hasAccessForPath("/medical-records") && (
              <NavLink to="/medical-records" className={menuClass}>
                <FaNotesMedical /><span>Records</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Nursing & Wards */}
        {(
          hasAccessForPath("/nurses") ||
          hasAccessForPath("/rooms") ||
          hasAccessForPath("/beds")
        ) && (
          <div className="nav-group">
            <span className="group-label">Nursing & Wards</span>
            {hasAccessForPath("/nurses") && (
              <NavLink to="/nurses" className={menuClass}>
                <FaUserNurse /><span>Nurses</span>
              </NavLink>
            )}
            {hasAccessForPath("/rooms") && (
              <NavLink to="/rooms" className={menuClass}>
                <FaHospital /><span>Rooms</span>
              </NavLink>
            )}
            {hasAccessForPath("/beds") && (
              <NavLink to="/beds" className={menuClass}>
                <FaBed /><span>Beds</span>
              </NavLink>
            )}
            <NavLink to="/ward-dashboard" className={menuClass}>
              <FaBed /><span>Ward Board</span>
            </NavLink>
            <NavLink to="/nurse-assignments" className={menuClass}>
              <FaUserNurse /><span>Assigns</span>
            </NavLink>
            <NavLink to="/nursing-notes" className={menuClass}>
              <FaNotesMedical /><span>Notes</span>
            </NavLink>
          </div>
        )}

        {/* Pharmacy & Lab */}
        {(
          hasAccessForPath("/medicines") ||
          hasAccessForPath("/lab-tests") ||
          hasAccessForPath("/lab-results") ||
          hasAccessForPath("/radiology") ||
          hasAccessForPath("/inventory")
        ) && (
          <div className="nav-group">
            <span className="group-label">Pharmacy & Lab</span>
            {hasAccessForPath("/medicines") && (
              <NavLink to="/medicines" className={menuClass}>
                <FaPills /><span>Meds</span>
              </NavLink>
            )}
            {hasAccessForPath("/lab-tests") && (
              <NavLink to="/lab-tests" className={menuClass}>
                <FaFileMedicalAlt /><span>Tests</span>
              </NavLink>
            )}
            {hasAccessForPath("/lab-results") && (
              <NavLink to="/lab-results" className={menuClass}>
                <FaFlask /><span>Results</span>
              </NavLink>
            )}
            {hasAccessForPath("/radiology") && (
              <NavLink to="/radiology" className={menuClass}>
                <FaXRay /><span>Radiology</span>
              </NavLink>
            )}
            {hasAccessForPath("/inventory") && (
              <NavLink to="/inventory" className={menuClass}>
                <FaBoxes /><span>Inventory</span>
              </NavLink>
            )}
            {hasAccessForPath("/pharmacy") && (
              <NavLink to="/pharmacy" className={menuClass}>
                <FaPills /><span>Pharmacy</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Accounts */}
        {(
          hasAccessForPath("/billing") ||
          hasAccessForPath("/accounts/dashboard")
        ) && (
          <div className="nav-group">
            <span className="group-label">Accounts</span>
            {hasAccessForPath("/accounts/dashboard") && (
              <NavLink to="/accounts/dashboard" className={menuClass}>
                <FaMoneyBillWave /><span>Dashboard</span>
              </NavLink>
            )}
            {hasAccessForPath("/accounts/income") && (
              <NavLink to="/accounts/income" className={menuClass}>
                <FaMoneyBillWave /><span>Income</span>
              </NavLink>
            )}
            {hasAccessForPath("/accounts/expense") && (
              <NavLink to="/accounts/expense" className={menuClass}>
                <FaMoneyBillWave /><span>Expense</span>
              </NavLink>
            )}
            {hasAccessForPath("/accounts/salary") && (
              <NavLink to="/accounts/salary" className={menuClass}>
                <FaMoneyBillWave /><span>Salary</span>
              </NavLink>
            )}
            {hasAccessForPath("/accounts/ledger") && (
              <NavLink to="/accounts/ledger" className={menuClass}>
                <FaMoneyBillWave /><span>Ledger</span>
              </NavLink>
            )}
            {hasAccessForPath("/billing") && (
              <NavLink to="/billing" className={menuClass}>
                <FaFileInvoiceDollar /><span>Billing</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Admin */}
        {(
          hasAccessForPath("/reports") ||
          hasAccessForPath("/users") ||
          hasAccessForPath("/employees")
        ) && (
          <div className="nav-group">
            <span className="group-label">Admin</span>
            {hasAccessForPath("/reports") && (
              <NavLink to="/reports" className={menuClass}>
                <FaChartBar /><span>Reports</span>
              </NavLink>
            )}
            <NavLink to="/financial-reports" className={menuClass}>
              <FaFileInvoiceDollar /><span>Fin Reports</span>
            </NavLink>
            {hasAccessForPath("/users") && (
              <NavLink to="/users" className={menuClass}>
                <FaUserCog /><span>Users</span>
              </NavLink>
            )}
            {hasAccessForPath("/employees") && (
              <NavLink to="/employees" className={menuClass}>
                <FaUserCog /><span>Employees</span>
              </NavLink>
            )}
            {hasAccessForPath("/attendance") && (
              <NavLink to="/attendance" className={menuClass}>
                <FaUserClock /><span>Attendance</span>
              </NavLink>
            )}
            {hasAccessForPath("/payroll") && (
              <NavLink to="/payroll" className={menuClass}>
                <FaMoneyCheckAlt /><span>Payroll</span>
              </NavLink>
            )}
            <NavLink to="/leaves" className={menuClass}>
              <FaClock /><span>Leaves</span>
            </NavLink>
            {hasAccessForPath("/activity-logs") && (
              <NavLink to="/activity-logs" className={menuClass}>
                <FaClock /><span>Logs</span>
              </NavLink>
            )}
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
