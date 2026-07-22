import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const PermissionContext = createContext();

// Maps route paths to the ModuleName used in RolePermissions table.
// Keep this in sync with the backend's AllModules list.
export const ROUTE_MODULE_MAP = {
  "/": "Dashboard",
  "/departments": "Departments",
  "/patients": "Patients",
  "/doctors": "Doctors",
  "/appointments": "Appointments",
  "/admissions": "Admissions",
  "/medical-records": "Medical Records",
  "/nurses": "Nurses",
  "/rooms": "Rooms",
  "/beds": "Beds",
  "/ward-dashboard": "Ward Dashboard",
  "/nurse-assignments": "Nurse Assignments",
  "/nursing-notes": "Nursing Notes",
  "/medicines": "Medicines",
  "/pharmacy": "Pharmacy Board",
  "/lab-tests": "Lab Tests",
  "/lab-results": "Lab Results",
  "/lab-results/add": "Lab Results",
  "/test-categories": "Test Categories",
  "/test-categories/edit/:id": "Test Categories",
  "/test-categories/add": "Test Categories",
  "/radiology": "Radiology",
  "/inventory": "Inventory",
  "/accounts/dashboard": "Accounts Dashboard",
  "/accounts/income": "Income",
  "/accounts/expense": "Expense",
  "/accounts/salary": "Salary",
  "/accounts/ledger": "Ledger",
  "/billing": "Billing",
  "/reports": "Reports",
  "/financial-reports": "Financial Reports",
  "/users": "Users",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/payroll": "Payroll",
  "/activity-logs": "Activity Logs",
};

export function PermissionProvider({ children }) {
  const [permissions, setPermissions] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPermissions({});
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/RolePermissions/my-permissions");
      const map = {};
      res.data.forEach((p) => {
        map[p.moduleName] = p.hasAccess;
      });
      setPermissions(map);
    } catch (err) {
      // If it fails (e.g. role not found, or endpoint error), default to no access
      // rather than silently granting everything.
      setPermissions({});
    } finally {
      setLoading(false);
    }
  };

  // hasAccess(moduleName) -> true/false. Role Permissions and Dashboard/Login
  // related pages are always allowed regardless of the map, since every
  // logged-in user needs to reach at least the dashboard.
  const hasAccess = (moduleName) => {
    if (!moduleName) return true;
    if (!permissions) return false;
    if (permissions[moduleName] === undefined) return true; // unmapped module: allow by default
    return permissions[moduleName];
  };

  const hasAccessForPath = (path) => {
    const moduleName = ROUTE_MODULE_MAP[path];
    return hasAccess(moduleName);
  };

  return (
    <PermissionContext.Provider
      value={{ permissions, loading, hasAccess, hasAccessForPath, reloadPermissions: loadPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}
