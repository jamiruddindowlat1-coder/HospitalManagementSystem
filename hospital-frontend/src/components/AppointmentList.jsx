import { useState, useEffect } from "react";
import api from "../services/api";
import "./SharedList.css";


function AppointmentList(){

const [appointments,setAppointments]=useState([]);
const [patients,setPatients]=useState([]);
const [doctors,setDoctors]=useState([]);

const [loading,setLoading]=useState(true);
const [error,setError]=useState("");

const [showForm,setShowForm]=useState(false);
const [submitting,setSubmitting]=useState(false);
const [editingId,setEditingId]=useState(null);


const emptyForm={
patientId:"",
doctorId:"",
appointmentDate:"",
appointmentTime:"",
reason:"",
status:"Scheduled"
};


const [form,setForm]=useState(emptyForm);



useEffect(()=>{

loadData();

},[]);





const loadData=async()=>{

try{

setLoading(true);


const [
appointmentRes,
patientRes,
doctorRes
]=await Promise.all([

api.get("/appointments"),

api.get("/patients"),

api.get("/doctors")

]);


setAppointments(appointmentRes.data);

setPatients(patientRes.data);

setDoctors(doctorRes.data);

setError("");

}
catch(err){

console.log(err);

setError("Appointment load failed");

}
finally{

setLoading(false);

}

};







const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};






const resetForm=()=>{

setForm(emptyForm);

setEditingId(null);

};








const saveAppointment=async(e)=>{

e.preventDefault();


try{

setSubmitting(true);



const data={

appointmentId:editingId || 0,

patientId:Number(form.patientId),

doctorId:Number(form.doctorId),

appointmentDate:form.appointmentDate,

appointmentTime:form.appointmentTime,

reason:form.reason,

status:form.status

};





if(editingId){

await api.put(
`/appointments/${editingId}`,
data
);

}
else{

await api.post(
"/appointments",
data
);

}



alert("Appointment Saved");


setShowForm(false);

resetForm();

loadData();


}
catch(err){

console.log(err);

alert("Save Failed");

}
finally{

setSubmitting(false);

}

};







const editAppointment=(a)=>{


setEditingId(a.appointmentId);


setForm({

patientId:a.patientId,

doctorId:a.doctorId,

appointmentDate:
a.appointmentDate?.substring(0,10),

appointmentTime:a.appointmentTime,

reason:a.reason,

status:a.status

});


setShowForm(true);


};








const deleteAppointment=async(id)=>{


if(!window.confirm("Delete Appointment?"))
return;


try{

await api.delete(
`/appointments/${id}`
);


loadData();


}
catch(err){

console.log(err);

}


};







if(loading)

return <h3>Loading...</h3>;






return(


<div className="page-container">



<div className="header-box">

<h2>
📅 Appointment Management
</h2>

</div>





<div className="count-box">

Total Appointment : {appointments.length}

</div>





<div style={{textAlign:"center"}}>


<button

className="btn-add"

onClick={()=>{

setShowForm(!showForm);

resetForm();

}}

>

{

showForm
?
"❌ Close"
:
"➕ Add Appointment"

}

</button>


</div>







{

error &&

<p className="error">

{error}

</p>

}







{

showForm &&


<form

className="table-container"

onSubmit={saveAppointment}

>



<select

name="patientId"

value={form.patientId}

onChange={handleChange}

required

>

<option value="">

Select Patient

</option>


{

patients.map(p=>(

<option

key={p.patientId}

value={p.patientId}

>

{p.fullName}

</option>

))

}


</select>





<select

name="doctorId"

value={form.doctorId}

onChange={handleChange}

required

>

<option value="">

Select Doctor

</option>


{

doctors.map(d=>(

<option

key={d.doctorId}

value={d.doctorId}

>

{d.fullName}

</option>

))

}


</select>





<input

type="date"

name="appointmentDate"

value={form.appointmentDate}

onChange={handleChange}

/>





<input

type="time"

name="appointmentTime"

value={form.appointmentTime}

onChange={handleChange}

/>






<input

name="reason"

placeholder="Reason"

value={form.reason}

onChange={handleChange}

/>






<select

name="status"

value={form.status}

onChange={handleChange}

>

<option value="Scheduled">
Scheduled
</option>

<option value="Completed">
Completed
</option>

<option value="Cancelled">
Cancelled
</option>


</select>






<button

className="btn-add"

disabled={submitting}

>

{

submitting
?
"Saving..."
:
editingId
?
"Update"
:
"Save"

}


</button>



</form>


}







<div className="table-container">


<table className="data-table">


<thead>

<tr>

<th>ID</th>

<th>Patient</th>

<th>Doctor</th>

<th>Date</th>

<th>Time</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>




<tbody>


{

appointments.map(a=>(


<tr key={a.appointmentId}>


<td>
#{a.appointmentId}
</td>


<td>

{a.patient?.fullName || "-"}

</td>


<td>

{a.doctor?.fullName || "-"}

</td>


<td>

{a.appointmentDate?.substring(0,10)}

</td>


<td>

{a.appointmentTime}

</td>


<td>

{a.status}

</td>



<td>


<button

className="btn-edit"

onClick={()=>editAppointment(a)}

>

✏ Edit

</button>




<button

className="btn-delete"

onClick={()=>deleteAppointment(a.appointmentId)}

>

🗑 Delete

</button>



</td>



</tr>


))


}


</tbody>



</table>


</div>




</div>


);


}


export default AppointmentList;