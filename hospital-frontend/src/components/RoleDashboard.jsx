import { getRole } from "../services/auth.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";
import NurseDashboard from "./NurseDashboard.jsx";
import PatientDashboard from "./PatientDashboard.jsx";
import ReceptionistDashboard from "./ReceptionistDashboard.jsx";

function RoleDashboard() {
    const role = getRole();

    switch (role) {
        case "Doctor":
            return <DoctorDashboard />;
        case "Nurse":
            return <NurseDashboard />;
        case "Patient":
            return <PatientDashboard />;
        case "Receptionist":
            return <ReceptionistDashboard />;
        case "Admin":
        default:
            return <AdminDashboard />;
    }
}

export default RoleDashboard;