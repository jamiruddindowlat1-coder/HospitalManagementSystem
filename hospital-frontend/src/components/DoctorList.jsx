import { useState, useEffect } from "react";
import api from "../services/api";
import "./Doctor.css";


function DoctorList(){


const [doctors,setDoctors]=useState([]);

const [departments,setDepartments]=useState([]);

const [loading,setLoading]=useState(true);

const [error,setError]=useState("");

const [showForm,setShowForm]=useState(false);

const [submitting,setSubmitting]=useState(false);

const [editingId,setEditingId]=useState(null);



const emptyForm={

fullName:"",
specialization:"",
departmentId:"",
phoneNumber:"",
email:"",
qualification:"",
experienceYears:"",
consultationFee:"",
isAvailable:true

};


const [form,setForm]=useState(emptyForm);





useEffect(()=>{

fetchDoctors();

fetchDepartments();

},[]);





const fetchDoctors=async()=>{

try{

setLoading(true);

const res=await api.get("/doctors");

setDoctors(res.data);

setError("");

}
catch(err){

console.log(err);

setError("Doctor load failed");

}
finally{

setLoading(false);

}

};





const fetchDepartments=async()=>{

try{

const res=await api.get("/departments");

setDepartments(res.data);

}
catch(err){

console.log(err);

}

};






const handleChange=(e)=>{


const value=
e.target.type==="checkbox"
?
e.target.checked
:
e.target.value;



setForm({

...form,

[e.target.name]:value

});


};






const resetForm=()=>{

setForm(emptyForm);

setEditingId(null);

};






const saveDoctor=async(e)=>{

e.preventDefault();


try{


setSubmitting(true);



const data={

doctorId:editingId || 0,

...form,

departmentId:Number(form.departmentId),

experienceYears:Number(form.experienceYears),

consultationFee:Number(form.consultationFee)

};




if(editingId){

await api.put(
`/doctors/${editingId}`,
data
);


}
else{


await api.post(
"/doctors",
data
);


}



alert("Doctor Saved");


setShowForm(false);

resetForm();

fetchDoctors();


}
catch(err){

console.log(err);

alert("Save failed");

}
finally{

setSubmitting(false);

}


};






const editDoctor=(d)=>{


setEditingId(d.doctorId);


setForm({

fullName:d.fullName,

specialization:d.specialization,

departmentId:d.departmentId,

phoneNumber:d.phoneNumber,

email:d.email,

qualification:d.qualification,

experienceYears:d.experienceYears,

consultationFee:d.consultationFee,

isAvailable:d.isAvailable

});


setShowForm(true);


};







const deleteDoctor=async(id)=>{


if(!window.confirm("Delete Doctor?"))
return;



try{

await api.delete(`/doctors/${id}`);

fetchDoctors();


}
catch(err){

console.log(err);

}


};






if(loading)

return <h3>Loading...</h3>;





return (

<div className="doctor-page">



<div className="doctor-header-box">

<h2>
👨‍⚕️ Doctor Management
</h2>

</div>




<div className="doctor-count-box">

Total Doctor : {doctors.length}

</div>






<div style={{textAlign:"center"}}>


<button

className="btn-add-doctor"

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
"➕ Add Doctor"

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

className="doctor-form"

onSubmit={saveDoctor}

>



<input

name="fullName"

placeholder="Doctor Name"

value={form.fullName}

onChange={handleChange}

/>



<input

name="specialization"

placeholder="Specialization"

value={form.specialization}

onChange={handleChange}

/>





<select

name="departmentId"

value={form.departmentId}

onChange={handleChange}

>

<option value="">

Select Department

</option>


{

departments.map(d=>(

<option

key={d.departmentId}

value={d.departmentId}

>

{d.departmentName}

</option>

))

}


</select>





<input

name="qualification"

placeholder="Qualification"

value={form.qualification}

onChange={handleChange}

/>





<input

name="phoneNumber"

placeholder="Phone"

value={form.phoneNumber}

onChange={handleChange}

/>





<input

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

/>





<input

type="number"

name="experienceYears"

placeholder="Experience"

value={form.experienceYears}

onChange={handleChange}

/>





<input

type="number"

name="consultationFee"

placeholder="Fee"

value={form.consultationFee}

onChange={handleChange}

/>





<button className="btn-save">

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







<div className="doctor-table-box">



<table className="doctor-table">


<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Specialization</th>

<th>Experience</th>

<th>Fee</th>

<th>Mobile</th>

<th>Action</th>


</tr>

</thead>




<tbody>


{

doctors.map(d=>(


<tr key={d.doctorId}>


<td>
#{d.doctorId}
</td>


<td>
{d.fullName}
</td>


<td>
{d.specialization}
</td>


<td>
{d.experienceYears} Years
</td>


<td>
{d.consultationFee} BDT
</td>


<td>
{d.phoneNumber}
</td>


<td>


<button

className="btn-edit"

onClick={()=>editDoctor(d)}

>

✏ Edit

</button>



<button

className="btn-delete"

onClick={()=>deleteDoctor(d.doctorId)}

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



export default DoctorList;