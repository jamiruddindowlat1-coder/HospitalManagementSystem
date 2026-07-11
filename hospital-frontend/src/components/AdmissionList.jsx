import { useEffect, useState } from "react";
import api from "../services/api";


function AdmissionList() {

  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    roomId: "",
    doctorId: "",
    admissionDate: "",
    dischargeDate: "",
    status: "Active",
  });

  const [editingId, setEditingId] = useState(null);



  const fetchAdmissions = async () => {

    try {

      setLoading(true);

      const res = await api.get("/admissions");

      console.log("Admissions Response:", res.data);

      setAdmissions(res.data);

    }
    catch(err){

      console.error(err);

      setError("Admission লোড করতে সমস্যা হয়েছে।");

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchAdmissions();

  },[]);



  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };



  const resetForm = ()=>{

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



  const handleSubmit = async(e)=>{

    e.preventDefault();


    const payload={

      patientId:Number(form.patientId),
      roomId:Number(form.roomId),
      doctorId:Number(form.doctorId),
      admissionDate:
        form.admissionDate ||
        new Date().toISOString(),

      dischargeDate:
        form.dischargeDate || null,

      status:form.status

    };


    try{


      if(editingId){

        await api.put(
          `/admissions/${editingId}`,
          {
            ...payload,
            admissionId:editingId
          }
        );

        alert("Admission আপডেট হয়েছে");

      }
      else{

        await api.post(
          "/admissions",
          payload
        );

        alert("Admission যোগ হয়েছে");

      }


      resetForm();

      fetchAdmissions();


    }
    catch(err){

      alert(
        "সমস্যা হয়েছে: "+
        err.message
      );

    }


  };



  const editAdmission=(a)=>{


    setEditingId(a.admissionId);


    setForm({

      patientId:a.patientId,
      roomId:a.roomId,
      doctorId:a.doctorId,

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


    if(!window.confirm("Admission Delete করবেন?"))
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

<div style={{padding:"20px"}}>


<h2>
🏥 Admission Management
</h2>



<form
onSubmit={handleSubmit}
style={formStyle}
>


<input
name="patientId"
placeholder="Patient ID"
value={form.patientId}
onChange={handleChange}
style={inputStyle}
/>


<input
name="roomId"
placeholder="Room ID"
value={form.roomId}
onChange={handleChange}
style={inputStyle}
/>


<input
name="doctorId"
placeholder="Doctor ID"
value={form.doctorId}
onChange={handleChange}
style={inputStyle}
/>



<input
type="datetime-local"
name="admissionDate"
value={form.admissionDate}
onChange={handleChange}
style={inputStyle}
/>



<input
type="datetime-local"
name="dischargeDate"
value={form.dischargeDate}
onChange={handleChange}
style={inputStyle}
/>



<select
name="status"
value={form.status}
onChange={handleChange}
style={inputStyle}
>

<option value="Active">
Active
</option>

<option value="Discharged">
Discharged
</option>

<option value="Pending">
Pending
</option>


</select>


<button style={btnStyle}>
{
editingId
?
"Update"
:
"Add Admission"
}
</button>


</form>



<h2>
📋 Admission List
</h2>



{
loading &&
<p>Loading...</p>
}



{
error &&
<p style={{color:"red"}}>
{error}
</p>
}



<table style={tableStyle}>


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
{a.patientName || "-"}
</td>


<td>
{a.roomNumber || "-"}
</td>


<td>
{a.doctorName || "-"}
</td>


<td>
{
new Date(
a.admissionDate
)
.toLocaleDateString()
}
</td>


<td>
{a.status}
</td>


<td>

<button
onClick={()=>editAdmission(a)}
>
✏️
</button>


<button
onClick={()=>deleteAdmission(a.admissionId)}
>
🗑️
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



const formStyle={

display:"grid",
gap:"10px",
maxWidth:"500px"

};


const inputStyle={

padding:"10px",
border:"1px solid #ccc",
borderRadius:"5px"

};


const btnStyle={

padding:"10px",
background:"#007bff",
color:"white",
border:"none",
cursor:"pointer"

};


const tableStyle={

width:"100%",
borderCollapse:"collapse",
marginTop:"20px"

};



export default AdmissionList;