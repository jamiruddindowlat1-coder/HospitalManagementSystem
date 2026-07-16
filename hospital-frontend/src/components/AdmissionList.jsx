import { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";


function AdmissionList() {


const [admissions,setAdmissions]=useState([]);
const [loading,setLoading]=useState(true);
const [error,setError]=useState("");



const [form,setForm]=useState({

 patientId:"",
 roomId:"",
 doctorId:"",
 admissionDate:"",
 dischargeDate:"",
 status:"Active"

});



const [editingId,setEditingId]=useState(null);





const fetchAdmissions=async()=>{

try{

setLoading(true);

const res=await api.get("/admissions");

console.log(res.data);

setAdmissions(res.data || []);

}

catch(err){

console.log(err);

setError("Admission load করতে সমস্যা হয়েছে");

}

finally{

setLoading(false);

}

};




useEffect(()=>{

fetchAdmissions();

},[]);





const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};





const resetForm=()=>{

setForm({

patientId:"",
roomId:"",
doctorId:"",
admissionDate:"",
dischargeDate:"",
status:"Active"

});

setEditingId(null);

};






const handleSubmit=async(e)=>{

e.preventDefault();


const data={

patientId:Number(form.patientId),

roomId:Number(form.roomId),

doctorId:Number(form.doctorId),

admissionDate:
form.admissionDate || new Date().toISOString(),

dischargeDate:
form.dischargeDate || null,

status:form.status

};



try{


if(editingId){

await api.put(

`/admissions/${editingId}`,

{
...data,
admissionId:editingId
}

);

alert("Admission Updated");


}

else{


await api.post(

"/admissions",

data

);


alert("Admission Added");


}



resetForm();

fetchAdmissions();


}

catch(err){

console.log(err);

alert(
"Error: "+err.message
);

}


};







const editAdmission=(a)=>{


setEditingId(a.admissionId);


setForm({

patientId:a.patientId || "",

roomId:a.roomId || "",

doctorId:a.doctorId || "",


admissionDate:
a.admissionDate
?
a.admissionDate.substring(0,16)
:
"",


dischargeDate:
a.dischargeDate
?
a.dischargeDate.substring(0,16)
:
"",


status:a.status || "Active"


});


};






const deleteAdmission=async(id)=>{


if(!window.confirm("Delete Admission?"))
return;



try{


await api.delete(`/admissions/${id}`);


fetchAdmissions();


}

catch(err){

alert(err.message);

}


};







return (

<div className="page-container">


<div className="header-box">

<h2>
🏥 Admission Management
</h2>

</div>



<div className="count-box">

Total Admissions: {admissions.length}

</div>





<form
onSubmit={handleSubmit}
className="table-container"
>


<input
name="patientId"
placeholder="Patient ID"
value={form.patientId}
onChange={handleChange}
/>



<input
name="roomId"
placeholder="Room ID"
value={form.roomId}
onChange={handleChange}
/>




<input
name="doctorId"
placeholder="Doctor ID"
value={form.doctorId}
onChange={handleChange}
/>




<input
type="datetime-local"
name="admissionDate"
value={form.admissionDate}
onChange={handleChange}
/>



<input
type="datetime-local"
name="dischargeDate"
value={form.dischargeDate}
onChange={handleChange}
/>





<select
name="status"
value={form.status}
onChange={handleChange}
>

<option>
Active
</option>

<option>
Discharged
</option>

<option>
Pending
</option>


</select>





<button className="btn-add">

{
editingId
?
"Update Admission"
:
"Save Admission"
}


</button>




{
editingId &&
<button
type="button"
className="btn-delete"
onClick={resetForm}
>

Cancel

</button>
}



</form>








<div className="table-container">


{
loading &&
<p>
Loading...
</p>
}



{
error &&
<p style={{color:"red"}}>
{error}
</p>
}





<table className="data-table">


<thead>

<tr>

<th>ID</th>

<th>Patient</th>

<th>Room</th>

<th>Doctor</th>

<th>Date</th>

<th>Status</th>

<th>Action</th>


</tr>

</thead>




<tbody>


{
admissions.map(a=>(


<tr key={a.admissionId}>


<td>
{a.admissionId}
</td>



<td>

{
a.patient?.fullName
||
"-"

}

</td>




<td>

{
a.room?.roomNumber
||
"-"

}

</td>




<td>

{
a.doctor?.fullName
||
"-"

}

</td>





<td>

{
a.admissionDate
?
new Date(a.admissionDate)
.toLocaleDateString()
:
"-"

}

</td>





<td>

{a.status}

</td>




<td>


<button

className="btn-edit"

onClick={()=>editAdmission(a)}

>

✏️ Edit

</button>




<button

className="btn-delete"

onClick={()=>deleteAdmission(a.admissionId)}

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



export default AdmissionList;