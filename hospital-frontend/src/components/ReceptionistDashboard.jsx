import "./ReceptionistDashboard.css";


import {

FaUserPlus,
FaCalendarPlus,
FaHospitalUser,
FaMoneyBill

} from "react-icons/fa6";


import StatCard from "./UI/StatCard";



function ReceptionistDashboard(){


return(

<div className="receptionist-dashboard">


<h2>
🧑‍💼 Receptionist Dashboard
</h2>




<div className="card-grid">


<StatCard

title="Total Patients"

value="10"

icon={<FaUserPlus/>}

color="#2563eb"

/>



<StatCard

title="Appointments"

value="6"

icon={<FaCalendarPlus/>}

color="#16a34a"

/>



<StatCard

title="Admissions"

value="11"

icon={<FaHospitalUser/>}

color="#9333ea"

/>



<StatCard

title="Billing"

value="20"

icon={<FaMoneyBill/>}

color="#dc2626"

/>


</div>






<div className="reception-module-grid">



<div className="reception-box">

<FaUserPlus/>

<h3>
Register Patient
</h3>

<p>
Create new patient
</p>

</div>





<div className="reception-box">

<FaCalendarPlus/>

<h3>
Appointments
</h3>

<p>
Manage booking
</p>

</div>





<div className="reception-box">

<FaHospitalUser/>

<h3>
Admissions
</h3>

<p>
Manage patient admission
</p>

</div>





<div className="reception-box">

<FaMoneyBill/>

<h3>
Billing
</h3>

<p>
Create bills
</p>

</div>




</div>



</div>


);


}


export default ReceptionistDashboard;