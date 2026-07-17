import React, { useEffect, useState } from "react";
import nurseService from "../services/nurseService";
import departmentService from "../services/departmentService";
import "./SharedList.css";

function NurseList() {
  const [nurses, setNurses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    shift: "Morning",
    departmentId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [nurseData, departmentData] = await Promise.all([
        nurseService.getAllNurses(),
        departmentService.getDepartments(),
      ]);

      setNurses(Array.isArray(nurseData) ? nurseData : []);
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Data load failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      fullName: "",
      phone: "",
      shift: "Morning",
      departmentId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        shift: formData.shift,
        departmentId: Number(formData.departmentId),
      };

      if (editingId) {
        await nurseService.updateNurse(editingId, payload);
      } else {
        await nurseService.createNurse(payload);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      setError("Save failed.");
    }
  };

  const handleEdit = (nurse) => {
    setEditingId(nurse.nurseId);
    setShowForm(true);
    setFormData({
      fullName: nurse.fullName,
      phone: nurse.phone,
      shift: nurse.shift,
      departmentId: nurse.departmentId,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this nurse?")) return;

    try {
      await nurseService.deleteNurse(id);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    }
  };

  const filteredNurses = nurses.filter((n) =>
    (n.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="page-container">

      <div className="header-box">
        <h2>👩‍⚕️ Nurse Management</h2>
      </div>

      <div className="count-box">
        Total Nurse : {nurses.length}
      </div>

      {error && (
        <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          className="btn-add"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingId(null);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✖️ Close Form" : "➕ Add Nurse"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="table-container" style={{ maxWidth: "500px", margin: "15px auto" }}>
          <h3 style={{ textAlign: "center" }}>
            {editingId ? "✏️ Edit Nurse" : "➕ New Nurse"}
          </h3>

          <label>Full Name</label>
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Shift</label>
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>

          <label>Department</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button type="submit" className="btn-add">
              {editingId ? "💾 Update" : "💾 Save"}
            </button>
            &nbsp;
            <button type="button" className="btn-delete" onClick={resetForm}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Shift</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredNurses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No nurses found.</td>
              </tr>
            ) : (
              filteredNurses.map((nurse) => (
                <tr key={nurse.nurseId}>
                  <td>{nurse.fullName}</td>
                  <td>{nurse.phone}</td>
                  <td>{nurse.shift}</td>
                  <td>{nurse.departmentName ?? "N/A"}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(nurse)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(nurse.nurseId)}>🗑 Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default NurseList;