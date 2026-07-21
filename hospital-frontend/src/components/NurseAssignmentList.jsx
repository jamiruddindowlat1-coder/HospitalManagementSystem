import { useEffect, useState } from "react";
import nurseAssignmentService from "../services/nurseAssignmentService";
import nurseService from "../services/nurseService";
import { getPatients } from "../services/patientService";
import "./SharedList.css";

function NurseAssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nurseId: "",
    patientId: "",
    releaseDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const assignData = await nurseAssignmentService.getAssignments();
      setAssignments(Array.isArray(assignData) ? assignData : []);
      
      const nurseData = await nurseService.getAllNurses();
      setNurses(Array.isArray(nurseData) ? nurseData : []);

      const patientData = await getPatients();
      setPatients(Array.isArray(patientData) ? patientData : []);
    } catch (error) {
      console.error("Load Assignments Error:", error);
      alert("Failed to load assignments.");
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

  const saveAssignment = async (e) => {
    e.preventDefault();
    try {
      if (!form.nurseId) {
        alert("Please select a nurse.");
        return;
      }
      if (!form.patientId) {
        alert("Please select a patient.");
        return;
      }

      const payload = {
        nurseId: parseInt(form.nurseId),
        patientId: parseInt(form.patientId),
        releaseDate: form.releaseDate ? new Date(form.releaseDate).toISOString() : null,
      };

      if (editingId) {
        await nurseAssignmentService.updateAssignment(editingId, payload);
        alert("Assignment Updated Successfully");
      } else {
        await nurseAssignmentService.createAssignment(payload);
        alert("Assignment Created Successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editAssignment = (a) => {
    setEditingId(a.nurseAssignmentId);
    setForm({
      nurseId: a.nurseId.toString(),
      patientId: a.patientId.toString(),
      releaseDate: a.releaseDate ? a.releaseDate.substring(0, 16) : "",
    });
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await nurseAssignmentService.deleteAssignment(id);
      alert("Assignment Deleted Successfully");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      nurseId: "",
      patientId: "",
      releaseDate: "",
    });
  };

  const filteredAssignments = assignments.filter(
    (a) =>
      a.nurseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>📋 Nurse Assignment Management</h2>
      </div>

      <div className="count-box">Total Assignments: {assignments.length}</div>

      <form onSubmit={saveAssignment} className="table-container">
        <h3>{editingId ? "✏️ Edit Assignment" : "➕ Assign Nurse to Patient"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select name="nurseId" value={form.nurseId} onChange={handleChange} required>
            <option value="">Select Nurse</option>
            {nurses.map((n) => (
              <option key={n.nurseId} value={n.nurseId}>
                {n.fullName} ({n.shift})
              </option>
            ))}
          </select>

          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>
                {p.fullName} (ID: {p.patientId})
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="releaseDate"
            placeholder="Release Date (Optional)"
            value={form.releaseDate}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn-add">
            {editingId ? "Update Assignment" : "Save Assignment"}
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
          placeholder="🔍 Search assignments..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading assignments...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nurse Name</th>
                <th>Patient Name</th>
                <th>Assigned Date</th>
                <th>Release Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="6">No Assignments Found.</td>
                </tr>
              ) : (
                filteredAssignments.map((a) => (
                  <tr key={a.nurseAssignmentId}>
                    <td>{a.nurseName}</td>
                    <td>{a.patientName}</td>
                    <td>{new Date(a.assignedDate).toLocaleString()}</td>
                    <td>{a.releaseDate ? new Date(a.releaseDate).toLocaleString() : "Active Assignment"}</td>
                    <td>
                      <span className={a.releaseDate ? "badge-inactive" : "badge-active"}>
                        {a.releaseDate ? "Released" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => editAssignment(a)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteAssignment(a.nurseAssignmentId)}>
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

export default NurseAssignmentList;
