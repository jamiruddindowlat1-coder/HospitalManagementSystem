import { useEffect, useState } from "react";
import nursingNoteService from "../services/nursingNoteService";
import nurseService from "../services/nurseService";
import { getPatients } from "../services/patientService";
import "./SharedList.css";

function NursingNoteList() {
  const [notes, setNotes] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    nurseId: "",
    temperature: "98.6",
    pulse: "72",
    bloodPressure: "120/80",
    respiration: "18",
    oxygen: "98",
    weight: "70",
    medicine: "",
    observation: "",
    remark: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const noteData = await nursingNoteService.getNotes();
      setNotes(Array.isArray(noteData) ? noteData : []);

      const nurseData = await nurseService.getAllNurses();
      setNurses(Array.isArray(nurseData) ? nurseData : []);

      const patientData = await getPatients();
      setPatients(Array.isArray(patientData) ? patientData : []);
    } catch (error) {
      console.error("Load Notes Error:", error);
      alert("Failed to load nursing notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveNote = async (e) => {
    e.preventDefault();
    try {
      if (!form.patientId) {
        alert("Please select a patient.");
        return;
      }
      if (!form.nurseId) {
        alert("Please select a nurse.");
        return;
      }

      const payload = {
        ...form,
        patientId: parseInt(form.patientId),
        nurseId: parseInt(form.nurseId),
      };

      if (editingId) {
        await nursingNoteService.updateNote(editingId, payload);
        alert("Nursing Note & Vitals Updated Successfully");
      } else {
        await nursingNoteService.createNote(payload);
        alert("Nursing Note & Vitals Saved Successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editNote = (n) => {
    setEditingId(n.nursingNoteId);
    setForm({
      patientId: n.patientId.toString(),
      nurseId: n.nurseId.toString(),
      temperature: n.temperature.toString(),
      pulse: n.pulse.toString(),
      bloodPressure: n.bloodPressure,
      respiration: n.respiration.toString(),
      oxygen: n.oxygen.toString(),
      weight: n.weight.toString(),
      medicine: n.medicine || "",
      observation: n.observation || "",
      remark: n.remark || "",
    });
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this nursing note?")) return;
    try {
      await nursingNoteService.deleteNote(id);
      alert("Nursing Note Deleted Successfully");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      patientId: "",
      nurseId: "",
      temperature: "98.6",
      pulse: "72",
      bloodPressure: "120/80",
      respiration: "18",
      oxygen: "98",
      weight: "70",
      medicine: "",
      observation: "",
      remark: "",
    });
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.nurseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.observation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>🌡️ Nursing Module - Vitals & Observations</h2>
      </div>

      <div className="count-box">Total Notes: {notes.length}</div>

      <form onSubmit={saveNote} className="table-container">
        <h3>{editingId ? "✏️ Edit Vitals & Notes" : "➕ Record New Vitals & Observations"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>
                {p.fullName} (ID: {p.patientId})
              </option>
            ))}
          </select>

          <select name="nurseId" value={form.nurseId} onChange={handleChange} required>
            <option value="">Select Nurse</option>
            {nurses.map((n) => (
              <option key={n.nurseId} value={n.nurseId}>
                {n.fullName} ({n.shift})
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.1"
            name="temperature"
            placeholder="Temp (°F)"
            value={form.temperature}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="pulse"
            placeholder="Pulse (BPM)"
            value={form.pulse}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="bloodPressure"
            placeholder="Blood Pressure (e.g. 120/80)"
            value={form.bloodPressure}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="respiration"
            placeholder="Respiration (breaths/min)"
            value={form.respiration}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="0.1"
            name="oxygen"
            placeholder="Oxygen Saturation (%)"
            value={form.oxygen}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="0.1"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="medicine"
            placeholder="Medicines Administered"
            value={form.medicine}
            onChange={handleChange}
          />

          <textarea
            name="observation"
            placeholder="Observations"
            value={form.observation}
            onChange={handleChange}
            style={{ width: "100%", maxWidth: "100%" }}
          />

          <textarea
            name="remark"
            placeholder="Remarks / Nursing Actions"
            value={form.remark}
            onChange={handleChange}
            style={{ width: "100%", maxWidth: "100%" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn-add">
            {editingId ? "Update Note" : "Save Vitals & Note"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px", padding: "6px 12px", borderRadius: "20px", border: "1px solid #ccc", cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ margin: "15px 0" }}>
        <input
          type="text"
          placeholder="🔍 Search notes..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading nursing notes...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Nurse</th>
                <th>Temp</th>
                <th>Pulse</th>
                <th>BP</th>
                <th>Oxygen</th>
                <th>Obs / Remark</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="9">No Vitals / Observations Found.</td>
                </tr>
              ) : (
                filteredNotes.map((n) => (
                  <tr key={n.nursingNoteId}>
                    <td>{n.patientName}</td>
                    <td>{n.nurseName}</td>
                    <td>{n.temperature} °F</td>
                    <td>{n.pulse} BPM</td>
                    <td>{n.bloodPressure}</td>
                    <td>{n.oxygen}%</td>
                    <td style={{ textAlign: "left", fontSize: "12px" }}>
                      <strong>Obs:</strong> {n.observation}<br/>
                      <strong>Remark:</strong> {n.remark}<br/>
                      <strong>Meds:</strong> {n.medicine || "None"}
                    </td>
                    <td>{new Date(n.createdDate).toLocaleString()}</td>
                    <td>
                      <button className="btn-edit" onClick={() => editNote(n)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteNote(n.nursingNoteId)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NursingNoteList;
