import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddTestCategory from "./components/AddTestCategory";
import EditTestCategory from "./components/EditTestCategory";
import TestCategoryList from "./components/TestCategoryList";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientList from "./components/PatientList";
import DoctorList from "./components/DoctorList";
import AppointmentList from "./components/AppointmentList";
import AdmissionList from "./components/AdmissionList";
import BillingList from "./components/BillingList";
import MedicalRecordList from "./components/MedicalRecordList";
import Medicine from "./components/Medicine";
import ActivityLogPage from "./components/ActivityLogPage";
import DepartmentList from "./components/DepartmentList";
import NurseList from "./components/NurseList";
import Reports from "./components/Reports";
import LabResultList from "./components/LabResultList";
import LabTestList from "./components/LabTestList";
import AddLabResult from "./components/AddLabResult";
import UserManagement from "./components/UserManagement";
import { isAuthenticated, removeToken } from "./services/auth";
import AppLayout from "./components/Layout/AppLayout";
import AccountsDashboard from "./components/AccountsDashboard";
import Income from "./components/Income";
import Expense from "./components/Expense";
import SalaryPayments from "./components/Salarypayments";
import Ledger from "./components/Ledger";
import FinancialReportsPage from "./components/FinancialReports/FinancialReportsPage";

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
      <Route path="/medical-records" element={wrap(MedicalRecordList)} />
      <Route path="/medicines" element={wrap(Medicine)} />
      <Route path="/departments" element={wrap(DepartmentList)} />
      <Route path="/nurses" element={wrap(NurseList)} />
      <Route path="/reports" element={wrap(Reports)} />
      <Route path="/financial-reports" element={wrap(FinancialReportsPage)} />
      <Route path="/lab-results" element={wrap(LabResultList)} />
      <Route path="/lab-tests" element={wrap(LabTestList)} />
      <Route path="/lab-results/add" element={wrap(AddLabResult)} />
      <Route path="/users" element={wrap(UserManagement)} />
      <Route path="/activity-logs" element={wrap(ActivityLogPage)} />
      <Route path="/test-categories" element={wrap(TestCategoryList)} />
      <Route path="/test-categories/edit/:id" element={wrap(EditTestCategory)} />
      <Route path="/test-categories/add" element={wrap(AddTestCategory)} />
      <Route path="/accounts/dashboard" element={wrap(AccountsDashboard)} />
      <Route path="/accounts/income" element={wrap(Income)} />
      <Route path="/accounts/expense" element={wrap(Expense)} />
      <Route path="/accounts/salary" element={wrap(SalaryPayments)} />
      <Route path="/accounts/ledger" element={wrap(Ledger)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;