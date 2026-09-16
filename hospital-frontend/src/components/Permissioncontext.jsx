import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.jsx";

const PermissionContext = createContext();

export function PermissionProvider({ children }) {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            loadPermissions();
        } else {
            setLoading(false);
        }
    }, []);

    const loadPermissions = async () => {
        try {
           const res = await api.get("/RolePermissions/my-permissions");
console.log("PERMCTX RAW:", res.data);
const data = {};
res.data.forEach(item => {
    data[item.moduleName] = item.hasAccess;
});
console.log("PERMCTX PARSED:", data);
setPermissions(data);
        } catch (error) {
            console.log("Permission load error", error);
            setPermissions({});
        } finally {
            setLoading(false);
        }
    };

    // Path → Backend ModuleName mapping (সব path cover করা হয়েছে)
    const pathToModule = {
        "/":                    "Dashboard",
        "/patients":            "Patients",
        "/doctors":             "Doctors",
        "/appointments":        "Appointments",
        "/admissions":          "Admissions",
        "/medical-records":     "Medical Records",
        "/nurses":              "Nurses",
        "/rooms":               "Rooms",
        "/beds":                "Beds",
        "/ward-dashboard":      "Ward Dashboard",
        "/nurse-assignments":   "Nurse Assignments",
        "/nursing-notes":       "Nursing Notes",
        "/billing":             "Billing",
        "/medicines":           "Medicines",
        "/pharmacy":            "Pharmacy Board",
        "/lab-tests":           "Lab Tests",
        "/lab-results":         "Lab Results",
        "/lab-results/add":     "Lab Results",
        "/test-categories":     "Test Categories",
        "/test-categories/add": "Test Categories",
        "/radiology":           "Radiology",
        "/inventory":           "Inventory",
        "/accounts/dashboard":  "Accounts Dashboard",
        "/accounts/income":     "Income",
        "/accounts/expense":    "Expense",
        "/accounts/salary":     "Salary",
        "/accounts/ledger":     "Ledger",
        "/reports":             "Reports",
        "/financial-reports":   "Financial Reports",
        "/users":               "Users",
        "/employees":           "Employees",
        "/attendance":          "Attendance",
        "/payroll":             "Payroll",
        "/leaves":              "Payroll",       // Leaves আলাদা module নেই, Payroll এর সাথে
        "/activity-logs":       "Activity Logs",
        "/mobile":              "Dashboard",     // Mobile portal — Dashboard access থাকলে দেখাবে
        "/role-permissions":    "Users",         // Users permission থাকলে দেখাবে
    };

    const hasAccessForPath = (path) => {
        const moduleName = pathToModule[path];

        // Map এ নেই মানে unknown path — false দেখাবে (আগে true ছিল, এটাই bug ছিল)
        if (!moduleName) return false;

        return permissions[moduleName] === true;
    };

    // Module name দিয়ে সরাসরি check করার জন্য
    const hasAccess = (moduleName) => {
        return permissions[moduleName] === true;
    };

    return (
        <PermissionContext.Provider value={{ permissions, loading, hasAccessForPath, hasAccess }}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermissions() {
    return useContext(PermissionContext);
}
