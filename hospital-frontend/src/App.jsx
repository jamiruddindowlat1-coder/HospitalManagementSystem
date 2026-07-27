import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Dashboard from "./components/AdminDashboard.jsx";
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
import RoomList from "./components/RoomList";
import BedList from "./components/BedList";

import NurseAssignmentList from "./components/NurseAssignmentList";
import NursingNoteList from "./components/NursingNoteList";

import Reports from "./components/Reports";
import FinancialReportsPage from "./components/FinancialReports/FinancialReportsPage";

import LabResultList from "./components/LabResultList";
import LabTestList from "./components/LabTestList";

import TestCategoryList from "./components/TestCategoryList";
import AddTestCategory from "./components/AddTestCategory";
import EditTestCategory from "./components/EditTestCategory";

import AddLabResult from "./components/AddLabResult";

import UserManagement from "./components/UserManagement";

import AccountsDashboard from "./components/AccountsDashboard";
import Income from "./components/Income";
import Expense from "./components/Expense";
import SalaryPayments from "./components/Salarypayments";
import Ledger from "./components/Ledger";

import RadiologyList from "./components/RadiologyList";
import InventoryList from "./components/InventoryList";

import EmployeeList from "./components/EmployeeList";
import AttendanceList from "./components/AttendanceList";
import PayrollList from "./components/PayrollList";
import LeaveList from "./components/LeaveList";

import PharmacyDashboard from "./components/PharmacyDashboard";
import WardDashboard from "./components/WardDashboard";
import MobilePortal from "./components/MobilePortal";

import RolePermissionsPage from "./components/RolePermissionsPage.jsx";


import ProtectedRoute from "./components/ProtectedRoute";
import PermissionRoute from "./components/PermissionRoute.jsx";

import AppLayout from "./components/Layout/AppLayout";

import { PermissionProvider } from "./components/PermissionContext.jsx";

import { isAuthenticated, removeToken } from "./services/auth";



function App(){


const [loggedIn,setLoggedIn]=useState(isAuthenticated());



const handleLogout=()=>{

removeToken();

setLoggedIn(false);

};





// Permission যুক্ত wrapper

const wrap=(Component,permission)=>(

<ProtectedRoute>

<AppLayout>

<PermissionRoute permission={permission}>

<Component/>

</PermissionRoute>

</AppLayout>

</ProtectedRoute>

);





return (

<PermissionProvider>


<Routes>



<Route
path="/login"
element={
loggedIn ?

<Navigate to="/" replace/>

:

<Login
onLogin={()=>setLoggedIn(true)}
/>

}
/>



<Route
path="/forgot-password"
element={<ForgotPassword/>}
/>



<Route
path="/reset-password"
element={<ResetPassword/>}
/>





<Route path="/" 
element={wrap(Dashboard,"Dashboard")}
/>



<Route path="/patients"
element={wrap(PatientList,"Patients")}
/>



<Route path="/doctors"
element={wrap(DoctorList,"Doctors")}
/>



<Route path="/appointments"
element={wrap(AppointmentList,"Appointments")}
/>



<Route path="/admissions"
element={wrap(AdmissionList,"Admissions")}
/>



<Route path="/billing"
element={wrap(BillingList,"Billing")}
/>



<Route path="/medical-records"
element={wrap(MedicalRecordList,"Medical Records")}
/>



<Route path="/medicines"
element={wrap(Medicine,"Medicines")}
/>



<Route path="/departments"
element={wrap(DepartmentList,"Departments")}
/>



<Route path="/nurses"
element={wrap(NurseList,"Nurses")}
/>



<Route path="/rooms"
element={wrap(RoomList,"Rooms")}
/>



<Route path="/beds"
element={wrap(BedList,"Beds")}
/>



<Route path="/nurse-assignments"
element={wrap(NurseAssignmentList,"Nurse Assignments")}
/>



<Route path="/nursing-notes"
element={wrap(NursingNoteList,"Nursing Notes")}
/>



<Route path="/reports"
element={wrap(Reports,"Reports")}
/>



<Route path="/financial-reports"
element={wrap(FinancialReportsPage,"Financial Reports")}
/>



<Route path="/lab-results"
element={wrap(LabResultList,"Lab Results")}
/>



<Route path="/lab-tests"
element={wrap(LabTestList,"Lab Tests")}
/>



<Route path="/lab-results/add"
element={wrap(AddLabResult,"Lab Results")}
/>



<Route path="/test-categories"
element={wrap(TestCategoryList,"Test Categories")}
/>



<Route path="/test-categories/add"
element={wrap(AddTestCategory,"Test Categories")}
/>



<Route path="/test-categories/edit/:id"
element={wrap(EditTestCategory,"Test Categories")}
/>



<Route path="/users"
element={wrap(UserManagement,"Users")}
/>



<Route path="/activity-logs"
element={wrap(ActivityLogPage,"Activity Logs")}
/>



<Route path="/accounts/dashboard"
element={wrap(AccountsDashboard,"Accounts Dashboard")}
/>



<Route path="/accounts/income"
element={wrap(Income,"Income")}
/>



<Route path="/accounts/expense"
element={wrap(Expense,"Expense")}
/>



<Route path="/accounts/salary"
element={wrap(SalaryPayments,"Salary")}
/>



<Route path="/accounts/ledger"
element={wrap(Ledger,"Ledger")}
/>



<Route path="/radiology"
element={wrap(RadiologyList,"Radiology")}
/>



<Route path="/inventory"
element={wrap(InventoryList,"Inventory")}
/>



<Route path="/employees"
element={wrap(EmployeeList,"Employees")}
/>



<Route path="/pharmacy"
element={wrap(PharmacyDashboard,"Pharmacy Board")}
/>



<Route path="/ward-dashboard"
element={wrap(WardDashboard,"Ward Dashboard")}
/>



<Route path="/attendance"
element={wrap(AttendanceList,"Attendance")}
/>



<Route path="/payroll"
element={wrap(PayrollList,"Payroll")}
/>



<Route path="/leaves"
element={wrap(LeaveList,"Leaves")}
/>



<Route path="/mobile"
element={wrap(MobilePortal,"Mobile Portal")}
/>



<Route path="/role-permissions"
element={wrap(RolePermissionsPage,"Users")}
/>



<Route
path="*"
element={<Navigate to="/" replace/>}
/>



</Routes>


</PermissionProvider>


);


}


export default App;