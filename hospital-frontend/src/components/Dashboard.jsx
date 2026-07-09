import { useEffect, useState } from "react";

import { getMedicines } from "../services/medicineService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import { getAppointments } from "../services/appointmentService";
import { getAdmissions } from "../services/admissionService";
import { getMedicalRecords } from "../services/medicalRecordService";


function Dashboard(){


const [dashboard,setDashboard]=useState({

    doctors:0,
    patients:0,
    appointments:0,
    medicines:0,
    admissions:0,
    records:0,
    available:0,
    lowStock:0,
    outStock:0,
    expiry:0

});



useEffect(()=>{


const loadDashboard=async()=>{

try{


const doctors = await getDoctors();
const patients = await getPatients();
const appointments = await getAppointments();
const medicines = await getMedicines();
const admissions = await getAdmissions();
const records = await getMedicalRecords();



setDashboard({

doctors:doctors.length,

patients:patients.length,

appointments:appointments.length,

medicines:medicines.length,

admissions:admissions.length,

records:records.length,


available:
medicines.filter(
x=>Number(x.stockQuantity)>10
).length,


lowStock:
medicines.filter(
x=>Number(x.stockQuantity)>0 &&
Number(x.stockQuantity)<=10
).length,


outStock:
medicines.filter(
x=>Number(x.stockQuantity)<=0
).length,


expiry:
medicines.filter(x=>{

if(!x.expiryDate)
return false;


let days=
(new Date(x.expiryDate)-new Date())
/(1000*60*60*24);


return days<=90 && days>0;


}).length


});


}
catch(error){

console.log(error);

}


};


loadDashboard();


},[]);





return (

<div className="container">


<h2>
🏥 Dashboard
</h2>



<div className="card-grid">



<div className="card">
<h3>👨‍⚕️ Doctors</h3>
<h2>{dashboard.doctors}</h2>
</div>



<div className="card">
<h3>🧑 Patients</h3>
<h2>{dashboard.patients}</h2>
</div>



<div className="card">
<h3>📅 Appointments</h3>
<h2>{dashboard.appointments}</h2>
</div>



<div className="card">
<h3>🏥 Admissions</h3>
<h2>{dashboard.admissions}</h2>
</div>



<div className="card">
<h3>📋 Medical Records</h3>
<h2>{dashboard.records}</h2>
</div>



<div className="card">
<h3>💊 Total Medicine</h3>
<h2>{dashboard.medicines}</h2>
</div>



<div className="card">
<h3>✅ Available</h3>
<h2>{dashboard.available}</h2>
</div>



<div className="card">
<h3>⚠ Low Stock</h3>
<h2>{dashboard.lowStock}</h2>
</div>



<div className="card">
<h3>❌ Out Stock</h3>
<h2>{dashboard.outStock}</h2>
</div>



<div className="card">
<h3>⏰ Expiring</h3>
<h2>{dashboard.expiry}</h2>
</div>



</div>


</div>

);


}


export default Dashboard;