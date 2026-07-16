import "./Dashboard.css";
import { useEffect, useState } from "react";
import DashboardChart from "./Charts/DashboardChart";
import AppointmentChart from "./Charts/AppointmentChart";
import MonthlyRevenueChart from "./Charts/MonthlyRevenueChart";
import PatientGrowthChart from "./Charts/PatientGrowthChart";
import DepartmentDoctorsChart from "./Charts/DepartmentDoctorsChart";
import MedicineStockChart from "./Charts/MedicineStockChart";
import RoomOccupancyChart from "./Charts/RoomOccupancyChart";
import {
  FaUserDoctor,
  FaUsers,
  FaCalendarCheck,
  FaHospitalUser,
  FaFileMedical,
  FaPills,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleXmark,
  FaClock,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaHourglassHalf,
  FaBed,
  FaDoorOpen,
  FaDoorClosed,
  FaTruckMedical,

} from "react-icons/fa6";

import {
  getDashboardSummary,
  getMonthlyRevenue,
  getPatientGrowth,
  getDoctorsByDepartment,
  getMedicineStock,
  getRoomOccupancy,
  getRecentActivities
} from "../services/dashboardService";

import {
  getMedicines
} from "../services/medicineService";

import StatCard from "./UI/StatCard";


function Dashboard(){

const [dashboard,setDashboard]=useState({

doctors:0,
patients:0,
appointments:0,
records:0,
medicines:0,
admissions:0,

available:0,
lowStock:0,
outStock:0,
expiry:0,

appointmentStatus:[],

// Billing Summary
totalBills:0,
paidBills:0,
pendingBills:0,
totalRevenue:0,

// Room Summary
totalRooms:0,
occupiedRooms:0,
availableRooms:0,

// Lists
todaysAppointments:[],
emergencyPatients:[],
recentAdmissions:[]

});

const [chartsData, setChartsData] = useState({
  monthlyRevenue: [],
  patientGrowth: [],
  doctorsByDepartment: [],
  medicineStock: [],
  roomOccupancy: []
});

const [recentActivities, setRecentActivities] = useState([]);


const [loading,setLoading]=useState(true);


useEffect(()=>{

const loadDashboard = async()=>{

try{

const summary = await getDashboardSummary();
const medicines = await getMedicines();

const [monthlyRevenue, patientGrowth, doctorsByDepartment, medicineStock, roomOccupancy, activities] =
  await Promise.all([
    getMonthlyRevenue(),
    getPatientGrowth(),
    getDoctorsByDepartment(),
    getMedicineStock(),
    getRoomOccupancy(),
    getRecentActivities(10)
  ]);

setChartsData({
  monthlyRevenue,
  patientGrowth,
  doctorsByDepartment,
  medicineStock,
  roomOccupancy
});

setRecentActivities(activities || []);

setDashboard({

doctors: summary.doctors,
patients: summary.patients,
appointments: summary.appointments,
records: summary.medicalRecords,

appointmentStatus: summary.appointmentStatus || [],

medicines: summary.medicines,
admissions: summary.admissions,

available:
medicines.filter(m=>Number(m.stockQuantity)>10).length,

lowStock:
medicines.filter(m=>
Number(m.stockQuantity)>0 &&
Number(m.stockQuantity)<=10
).length,

outStock:
medicines.filter(m=>Number(m.stockQuantity)<=0).length,

expiry:
medicines.filter(m=>{
if(!m.expiryDate) return false;
const days =
(new Date(m.expiryDate)-new Date())/(1000*60*60*24);
return days<=90 && days>0;
}).length,

// Billing Summary
totalBills: summary.totalBills,
paidBills: summary.paidBills,
pendingBills: summary.pendingBills,
totalRevenue: summary.totalRevenue,

// Room Summary
totalRooms: summary.totalRooms,
occupiedRooms: summary.occupiedRooms,
availableRooms: summary.availableRooms,

// Lists
todaysAppointments: summary.todaysAppointments || [],
emergencyPatients: summary.emergencyPatients || [],
recentAdmissions: summary.recentAdmissions || []

});

}
catch(error){
console.log("Dashboard Loading Error:", error);
}
finally{
setLoading(false);
}

};

loadDashboard();

},[]);


const chartData=[
{ name:"Doctors", value:dashboard.doctors },
{ name:"Patients", value:dashboard.patients },
{ name:"Appointments", value:dashboard.appointments },
{ name:"Medical Records", value:dashboard.records },
{ name:"Medicine", value:dashboard.medicines }
];


if(loading){
return(
<div className="dashboard">
<h2>Loading Dashboard...</h2>
</div>
);
}


return(
<div className="dashboard-dense">
  <div className="dashboard-top-section">
    <div className="card-grid">

<StatCard title="Doctors" value={dashboard.doctors} icon={<FaUserDoctor/>} color="#2563eb" />
<StatCard title="Patients" value={dashboard.patients} icon={<FaUsers/>} color="#16a34a" />
<StatCard title="Appointments" value={dashboard.appointments} icon={<FaCalendarCheck/>} color="#9333ea" />
<StatCard title="Admissions" value={dashboard.admissions} icon={<FaHospitalUser/>} color="#ea580c" />
<StatCard title="Medical Records" value={dashboard.records} icon={<FaFileMedical/>} color="#0891b2" />
<StatCard title="Total Medicine" value={dashboard.medicines} icon={<FaPills/>} color="#be123c" />
<StatCard title="Available" value={dashboard.available} icon={<FaCircleCheck/>} color="#15803d" />
<StatCard title="Low Stock" value={dashboard.lowStock} icon={<FaTriangleExclamation/>} color="#ca8a04" />
<StatCard title="Out Stock" value={dashboard.outStock} icon={<FaCircleXmark/>} color="#dc2626" />
<StatCard title="Expiring Soon" value={dashboard.expiry} icon={<FaClock/>} color="#7c3aed" />
    </div>
  </div>

  <div className="charts-grid">

    <DashboardChart data={chartData} />
    <AppointmentChart data={dashboard.appointmentStatus} />
    <MonthlyRevenueChart data={chartsData.monthlyRevenue} />
    <PatientGrowthChart data={chartsData.patientGrowth} />
    <DepartmentDoctorsChart data={chartsData.doctorsByDepartment} />
    <MedicineStockChart data={chartsData.medicineStock} />
    <RoomOccupancyChart data={chartsData.roomOccupancy} />
  </div>

  <div className="lists-grid">
    <div className="list-wrapper">
      <h4>📅 Today's Appointments</h4>
<div className="list-panel">
{dashboard.todaysAppointments.length === 0 ? (
<p className="empty-text">No appointments scheduled for today.</p>
) : (
<table className="dashboard-table">
<thead>
<tr>
<th>Patient</th>
<th>Doctor</th>
<th>Time</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{dashboard.todaysAppointments.map(a=>(
<tr key={a.appointmentId}>
<td>{a.patientName}</td>
<td>{a.doctorName}</td>
<td>{a.appointmentTime}</td>
<td>{a.status}</td>
</tr>
))}
</tbody>
</table>
)}
    </div>
    </div>
    <div className="list-wrapper">
      <h4>🚨 Emergency Patients</h4>
      <div className="list-panel">
{dashboard.emergencyPatients.length === 0 ? (
<p className="empty-text">No emergency patients currently admitted.</p>
) : (
<table className="dashboard-table">
<thead>
<tr>
<th>Patient</th>
<th>Room</th>
<th>Admission Date</th>
</tr>
</thead>
<tbody>
{dashboard.emergencyPatients.map(e=>(
<tr key={e.admissionId} className="emergency-row">
<td><FaTruckMedical style={{marginRight:6, color:"#dc2626"}}/>{e.patientName}</td>
<td>{e.roomNumber}</td>
<td>{new Date(e.admissionDate).toLocaleDateString()}</td>
</tr>
))}
</tbody>
</table>
)}
    </div>
    </div>
    <div className="list-wrapper">
      <h4>📢 Recent Admissions</h4>
      <div className="list-panel">
{dashboard.recentAdmissions.length === 0 ? (
<p className="empty-text">No recent admissions.</p>
) : (
<table className="dashboard-table">
<thead>
<tr>
<th>Patient</th>
<th>Room</th>
<th>Admission Date</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{dashboard.recentAdmissions.map(r=>(
<tr key={r.admissionId}>
<td>{r.patientName}</td>
<td>{r.roomNumber}</td>
<td>{new Date(r.admissionDate).toLocaleDateString()}</td>
<td>{r.status}</td>
</tr>
))}
</tbody>
</table>
)}
    </div>
    </div>
    <div className="list-wrapper">
      <h4><FaClock style={{marginRight:8}}/>Recent Activities</h4>
      <div className="list-panel">
{recentActivities.length === 0 ? (
<p className="empty-text">No recent activity recorded.</p>
) : (
<table className="dashboard-table">
<thead>
<tr>
<th>Action</th>
<th>Entity</th>
<th>Description</th>
<th>By</th>
<th>Time</th>
</tr>
</thead>
<tbody>
{recentActivities.map((log, index)=>(
<tr key={index}>
<td>{log.action}</td>
<td>{log.entity}</td>
<td>{log.description}</td>
<td>{log.userName || "System"}</td>
<td>{new Date(log.createdAt).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
)}
      </div>
    </div>
  </div>
</div>
);
}

export default Dashboard;