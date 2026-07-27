import "./DoctorDashboard.css";

import {
 FaUsers,
 FaCalendarCheck,
 FaFileMedical,
 FaPills,
 FaVial,
 FaRadiation,
 FaBed,
 FaNotesMedical
} from "react-icons/fa6";

import StatCard from "./UI/StatCard";


function DoctorDashboard(){


return (

<div className="doctor-dashboard">


<h2>
👨‍⚕️ Doctor Dashboard
</h2>



<div className="card-grid">


<StatCard

title="My Patients"

value="10"

icon={<FaUsers/>}

color="#2563eb"

/>



<StatCard

title="Today's Appointments"

value="6"

icon={<FaCalendarCheck/>}

color="#16a34a"

/>



<StatCard

title="Medical Records"

value="3"

icon={<FaFileMedical/>}

color="#9333ea"

/>



<StatCard

title="Medicines"

value="9"

icon={<FaPills/>}

color="#dc2626"

/>


</div>





<div className="doctor-module-grid">



<div className="doctor-box">

<FaUsers/>

<h3>
Patients
</h3>

<p>
View assigned patients
</p>


</div>





<div className="doctor-box">

<FaCalendarCheck/>

<h3>
Appointments
</h3>

<p>
Manage appointments
</p>


</div>






<div className="doctor-box">

<FaNotesMedical/>

<h3>
Medical Records
</h3>

<p>
Create and update records
</p>


</div>






<div className="doctor-box">

<FaBed/>

<h3>
Ward Board
</h3>

<p>
View admitted patients
</p>


</div>







<div className="doctor-box">

<FaVial/>

<h3>
Lab Results
</h3>

<p>
Check test reports
</p>


</div>







<div className="doctor-box">

<FaRadiation/>

<h3>
Radiology
</h3>

<p>
View radiology reports
</p>


</div>






</div>



</div>


);

}


export default DoctorDashboard;