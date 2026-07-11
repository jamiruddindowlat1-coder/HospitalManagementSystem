import { useEffect, useState } from "react";
import api from "../services/api";


function PatientList() {


const emptyForm = {
    fullName:"",
    dateOfBirth:"",
    age:0,
    gender:"Male",
    bloodGroup:"",
    contactNumber:"",
    email:"",
    address:"",
    emergencyContactName:"",
    emergencyContactNumber:"",
    medicalHistory:"",
    registeredAt:new Date().toISOString()
};



const [patients,setPatients] = useState([]);

const [form,setForm] = useState(emptyForm);

const [loading,setLoading] = useState(true);

const [error,setError] = useState("");

const [showForm,setShowForm] = useState(false);

const [editId,setEditId] = useState(null);

const [search,setSearch] = useState("");

const [submitting,setSubmitting] = useState(false);





useEffect(()=>{

    loadPatients();

},[]);





const loadPatients = async()=>{

    try{

        setLoading(true);

        const response = await api.get("/patients");

        setPatients(response.data);

        setError("");

    }
    catch(error){

        console.log(error);

        setError("Patient load failed");

    }
    finally{

        setLoading(false);

    }

};





const calculateAge=(dob)=>{

    if(!dob)
        return 0;


    const birth = new Date(dob);

    const today = new Date();


    let age = today.getFullYear() - birth.getFullYear();


    const month = today.getMonth() - birth.getMonth();


    if(
        month < 0 ||
        (month === 0 && today.getDate() < birth.getDate())
    )
    {
        age--;
    }


    return age;

};





const handleChange=(e)=>{

    setForm({

        ...form,

        [e.target.name]:e.target.value

    });

};







const savePatient = async(e)=>{

e.preventDefault();


try{


setSubmitting(true);



const patientData = {

    fullName: form.fullName,

    dateOfBirth: form.dateOfBirth,

    age: calculateAge(form.dateOfBirth),

    gender: form.gender,

    bloodGroup: form.bloodGroup,

    contactNumber: form.contactNumber,

    email: form.email,

    address: form.address,

    emergencyContactName: form.emergencyContactName,

    emergencyContactNumber: form.emergencyContactNumber,

    medicalHistory: form.medicalHistory,

    registeredAt:new Date().toISOString()

};





if(editId){


    await api.put(

        `/patients/${editId}`,

        {

            patientId:editId,

            ...patientData

        }

    );


}
else{


    await api.post(

        "/patients",

        patientData

    );


}




alert("Patient Saved Successfully");


setForm(emptyForm);

setEditId(null);

setShowForm(false);


loadPatients();



}
catch(error){

    console.log(error);

    alert("Save Failed");

}
finally{

    setSubmitting(false);

}


};









const editPatient=(patient)=>{


setEditId(patient.patientId);


setForm({

    ...emptyForm,

    ...patient,

    dateOfBirth:

    patient.dateOfBirth

    ?

    patient.dateOfBirth.substring(0,10)

    :

    ""

});


setShowForm(true);


};









const deletePatient=async(id)=>{


if(!window.confirm("Delete this patient?"))

return;



try{


await api.delete(`/patients/${id}`);


alert("Deleted Successfully");


loadPatients();


}
catch(error){

console.log(error);

alert("Delete Failed");


}


};








const filteredPatients = patients.filter(patient=>

patient.fullName

?.toLowerCase()

.includes(search.toLowerCase())

);







if(loading)

return <h3>Loading...</h3>;







return (

<div className="data-card">


<h2>🏥 Patient Management</h2>


<h3>
Total Patient : {patients.length}
</h3>




<button

onClick={()=>{

setShowForm(!showForm);

setEditId(null);

setForm(emptyForm);

}}

>

{

showForm

?

"❌ Close"

:

"➕ Add Patient"

}


</button>





<br/><br/>





<input

placeholder="Search Patient"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>





{

error &&

<p style={{color:"red"}}>

{error}

</p>

}







{

showForm &&

(

<form onSubmit={savePatient}>


<br/>


<input

name="fullName"

placeholder="Full Name"

value={form.fullName}

onChange={handleChange}

/>



<br/>


<input

type="date"

name="dateOfBirth"

value={form.dateOfBirth}

onChange={handleChange}

/>





<br/>


<select

name="gender"

value={form.gender}

onChange={handleChange}

>


<option value="Male">

Male

</option>


<option value="Female">

Female

</option>


</select>





<br/>


<input

name="bloodGroup"

placeholder="Blood Group"

value={form.bloodGroup}

onChange={handleChange}

/>





<br/>


<input

name="contactNumber"

placeholder="Phone"

value={form.contactNumber}

onChange={handleChange}

/>





<br/>


<textarea

name="medicalHistory"

placeholder="Medical History"

value={form.medicalHistory}

onChange={handleChange}

/>





<br/>


<button disabled={submitting}>


{

submitting

?

"Saving..."

:

editId

?

"Update Patient"

:

"Save Patient"

}



</button>


</form>

)

}









<table border="1" width="100%">


<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Age</th>

<th>Gender</th>

<th>Phone</th>

<th>Action</th>


</tr>

</thead>





<tbody>


{

filteredPatients.map(patient=>(


<tr key={patient.patientId}>


<td>

{patient.patientId}

</td>



<td>

{patient.fullName}

</td>



<td>

{calculateAge(patient.dateOfBirth)}

</td>



<td>

{patient.gender}

</td>



<td>

{patient.contactNumber}

</td>




<td>


<button

onClick={()=>editPatient(patient)}

>

✏️ Edit

</button>


&nbsp;


<button

onClick={()=>deletePatient(patient.patientId)}

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

);


}



export default PatientList;