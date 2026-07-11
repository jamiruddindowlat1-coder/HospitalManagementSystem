import { useEffect, useState } from "react";
import api from "../services/api";

function Admission({onSuccess}) {

  const [patients,setPatients] = useState([]);
  const [rooms,setRooms] = useState([]);
  const [doctors,setDoctors] = useState([]);
  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState("");

  const [form,setForm] = useState({
    patientId:"",
    roomId:"",
    doctorId:"",
    admissionDate:"",
    dischargeDate:"",
    status:"Active"
  });

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async()=>{
    try{
      const patientsRes = await api.get("/patients");
      setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : patientsRes.data.data || []);
    }
    catch(err){
      console.log("Patient API Error",err);
    }

    try{
      const roomsRes = await api.get("/rooms");
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data.data || []);
    }
    catch(err){
      console.log("Room API Error",err);
    }

    try{
      const doctorsRes = await api.get("/doctors");
      setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : doctorsRes.data.data || []);
    }
    catch(err){
      console.log("Doctor API Error",err);
    }
  };

  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      setLoading(true);

      const data={
        patientId:Number(form.patientId),
        roomId:Number(form.roomId),
        doctorId:Number(form.doctorId),
        admissionDate: new Date(form.admissionDate).toISOString(),
        dischargeDate: form.dischargeDate ? new Date(form.dischargeDate).toISOString() : null,
        status:form.status
      };

      await api.post("/admissions", data);

      setMessage("✅ Admission সফলভাবে যোগ হয়েছে!");

      setForm({
        patientId:"",
        roomId:"",
        doctorId:"",
        admissionDate:"",
        dischargeDate:"",
        status:"Active"
      });

      if (onSuccess) onSuccess();

    }
    catch(err){
      console.log(err);
      setMessage("❌ Admission save হয়নি");
    }
    finally{
      setLoading(false);
    }
  };

  return(
    <div style={container}>
      <h2>🏥 Admission Management</h2>

      {message && <p>{message}</p>}

      <form onSubmit={submitHandler}>

        <select name="patientId" value={form.patientId} onChange={handleChange} required style={input}>
          <option value="">Select Patient</option>
          {patients.map(p=>(
            <option key={p.patientId} value={p.patientId}>
              {p.fullName || p.name || "Patient "+p.patientId}
            </option>
          ))}
        </select>

        <select name="roomId" value={form.roomId} onChange={handleChange} required style={input}>
          <option value="">Select Room</option>
          {rooms.map(r=>(
            <option key={r.roomId} value={r.roomId}>
              Room {r.roomNumber}
            </option>
          ))}
        </select>

        <select name="doctorId" value={form.doctorId} onChange={handleChange} required style={input}>
          <option value="">Select Doctor</option>
          {doctors.map(d=>(
            <option key={d.doctorId} value={d.doctorId}>
              {d.fullName || d.name || "Doctor "+d.doctorId}
            </option>
          ))}
        </select>

        <input type="datetime-local" name="admissionDate" value={form.admissionDate} onChange={handleChange} required style={input} />

        <input type="datetime-local" name="dischargeDate" value={form.dischargeDate} onChange={handleChange} style={input} />

        <select name="status" value={form.status} onChange={handleChange} style={input}>
          <option>Active</option>
          <option>Discharged</option>
          <option>Pending</option>
        </select>

        <button disabled={loading} style={button}>
          {loading ? "Saving..." : "➕ Add Admission"}
        </button>

      </form>
    </div>
  );
}

const container={
  padding:"20px"
};

const input={
  display:"block",
  width:"400px",
  padding:"10px",
  margin:"10px",
};

const button={
  padding:"10px 20px",
  background:"#007bff",
  color:"white",
  border:"none"
};

export default Admission;