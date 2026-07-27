import "./PatientDashboard.css";

import {
  FaCalendarCheck,
  FaFileMedical,
  FaUserDoctor,
  FaVial,
  FaPrescriptionBottleMedical
} from "react-icons/fa6";

import StatCard from "./UI/StatCard";


function PatientDashboard(){


const patientData = {

appointments: 3,
records: 5,
doctor: 1,
labReports: 2

};



return (

<div className="patient-dashboard">


<h2>
🧑‍🦽 Patient Dashboard
</h2>



<div className="card-grid">


<StatCard

title="My Appointments"

value={patientData.appointments}

icon={<FaCalendarCheck/>}

color="#2563eb"

/>



<StatCard

title="Medical Records"

value={patientData.records}

icon={<FaFileMedical/>}

color="#16a34a"

/>



<StatCard

title="My Doctor"

value={patientData.doctor}

icon={<FaUserDoctor/>}

color="#9333ea"

/>



<StatCard

title="Lab Reports"

value={patientData.labReports}

icon={<FaVial/>}

color="#dc2626"

/>


</div>





<div className="patient-module-grid">



<div className="patient-box">

<FaCalendarCheck/>

<h3>
Appointments
</h3>

<p>
View upcoming appointments
</p>

</div>




<div className="patient-box">

<FaFileMedical/>

<h3>
Medical Records
</h3>

<p>
View medical history
</p>

</div>




<div className="patient-box">

<FaPrescriptionBottleMedical/>

<h3>
Prescriptions
</h3>

<p>
View prescribed medicines
</p>

</div>




<div className="patient-box">

<FaVial/>

<h3>
Lab Results
</h3>

<p>
Check laboratory reports
</p>

</div>



</div>


</div>

);


}


export default PatientDashboard;