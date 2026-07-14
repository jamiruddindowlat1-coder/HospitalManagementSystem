import { useEffect, useState } from "react";
import api from "../services/api";
import "./PatientList.css";


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

        console.log("PATIENT API STATUS:", response.status);

        console.log("PATIENT DATA:", response.data);


        if(Array.isArray(response.data)){

            setPatients(response.data);

        }
        else{

            setPatients([]);

            console.log(
                "Patient data is not array"
            );

        }


        setError("");

    }
    catch(error){

        console.log(
            "PATIENT ERROR:",
            error.response || error
        );


        setError(
            "Patient load failed"
        );

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

<div className="patient-page">

<div className="patient-header-box">
<h2>🏥 Patient Management</h2>
</div>

<div className="patient-count-box">
Total Patient : {patients.length}
</div>




<div style={{textAlign:"center"}}>

<button
className="btn-add-patient"
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

</div>




<input
className="patient-search-box"
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

<form onSubmit={savePatient} className="patient-table-box" style={{padding:"25px", marginBottom:"20px"}}>


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


<button className="btn-add-patient" disabled={submitting}>


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









<div className="patient-table-box">

<table className="patient-table" width="100%">


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

<span className={patient.gender === "Male" ? "badge-male" : "badge-female"}>
{patient.gender}
</span>

</td>



<td>

{patient.contactNumber}

</td>




<td>


<button
className="btn-edit"
onClick={()=>editPatient(patient)}

>

✏️ Edit

</button>


&nbsp;


<button
className="btn-delete"
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



</div>

);


}



export default PatientList;
