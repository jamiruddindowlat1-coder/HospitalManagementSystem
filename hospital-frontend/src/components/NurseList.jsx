import React, { useEffect, useState } from "react";
import nurseService from "../services/nurseService";
import departmentService from "../services/departmentService";

function NurseList() {
  const [nurses, setNurses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👩‍⚕️ Nurse Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Nurse"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>

          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option
                key={d.departmentId}
                value={d.departmentId}
              >
                {d.departmentName}
              </option>
            ))}
          </select>

          <button type="submit">
            {editingId ? "Update" : "Save"}
          </button>
        </form>
      )}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
      >
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
          {nurses.length === 0 ? (
            <tr>
              <td colSpan="5">No nurses found.</td>
            </tr>
          ) : (
            nurses.map((nurse) => (
              <tr key={nurse.nurseId}>
                <td>{nurse.fullName}</td>
                <td>{nurse.phone}</td>
                <td>{nurse.shift}</td>
                <td>{nurse.departmentName ?? "N/A"}</td>
                <td>
                  <button onClick={() => handleEdit(nurse)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(nurse.nurseId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NurseList;