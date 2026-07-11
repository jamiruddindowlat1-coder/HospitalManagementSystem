import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Admission from "./components/Admission";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientList from "./components/PatientList";
import DoctorList from "./components/DoctorList";
import AppointmentList from "./components/AppointmentList";
import BillingList from "./components/BillingList";
import MedicalRecordList from "./components/MedicalRecordList";
import Medicine from "./components/Medicine";

import { isAuthenticated, removeToken } from "./services/auth";
import api from "./services/api";

import AppLayout from "./components/Layout/AppLayout";

function AdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAdmissions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admissions");

      setAdmissions(response.data || response);
    } catch (error) {
      console.log(error);
      setMessage("❌ Admission data load করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissions();
  }, []);

  return (
    <div style={containerStyle}>
      <Admission onSuccess={loadAdmissions} />

      <hr style={{ margin: "30px 0" }} />

      <h3>📋 Current Admissions</h3>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Room</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map((a) => (
              <tr key={a.admissionId || a.id}>
                <td>{a.patient?.fullName || a.patientName || "-"}</td>

                <td>{a.room?.roomNumber || a.roomNumber || "-"}</td>

                <td>{a.doctor?.fullName || a.doctorName || "-"}</td>

                <td>{a.status}</td>

                <td>
                  {a.admissionDate
                    ? new Date(a.admissionDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  const wrap = (Component) => (
    <ProtectedRoute>
      <AppLayout>
        <Component />
      </AppLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={() => setLoggedIn(true)} />
          )
        }
      />

      <Route path="/" element={wrap(Dashboard)} />
      <Route path="/patients" element={wrap(PatientList)} />
      <Route path="/doctors" element={wrap(DoctorList)} />
      <Route path="/appointments" element={wrap(AppointmentList)} />
      <Route path="/admissions" element={wrap(AdmissionList)} />
      <Route path="/billing" element={wrap(BillingList)} />
      <Route path="/records" element={wrap(MedicalRecordList)} />
      <Route path="/medicines" element={wrap(Medicine)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const containerStyle = {
  padding: "24px",
  maxWidth: "1000px",
  margin: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

export default App;