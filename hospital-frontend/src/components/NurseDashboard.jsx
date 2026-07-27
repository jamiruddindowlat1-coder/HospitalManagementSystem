import "./NurseDashboard.css";

import AppointmentChart from "./Charts/AppointmentChart";
import RoomOccupancyChart from "./Charts/RoomOccupancyChart";

import {
  FaCalendarCheck,
  FaBed,
  FaUserNurse
} from "react-icons/fa6";



function NurseDashboard(){

return(

<div className="nurse-dashboard">


<h2>
👩‍⚕️ Nurse Dashboard
</h2>



<div className="card-grid">


<div className="nurse-box">

<FaCalendarCheck />

<h3>
Appointments
</h3>

<p>
Check patient appointments
</p>

</div>



<div className="nurse-box">

<FaBed />

<h3>
Room Occupancy
</h3>

<p>
Monitor patient rooms
</p>

</div>



<div className="nurse-box">

<FaUserNurse />

<h3>
Patient Care
</h3>

<p>
Manage nursing activities
</p>

</div>


</div>




<div className="nurse-table-wrapper">

<h3>
📅 Appointment Status
</h3>

<AppointmentChart />

</div>




<div className="nurse-table-wrapper">

<h3>
🛏 Room Status
</h3>

<RoomOccupancyChart />

</div>



</div>

);

}


export default NurseDashboard;