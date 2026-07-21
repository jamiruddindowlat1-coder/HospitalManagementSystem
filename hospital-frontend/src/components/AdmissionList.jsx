import React, { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  patientId: "",
  roomId: "",
  doctorId: "",
  admissionDate: "",
  dischargeDate: "",
  reason: "",
  status: "Admitted",
};

export default function AdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmissions();
    fetchDropdownData();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admissions");
      console.log("API: GET /admissions", res.data);
      setAdmissions(res.data);
    } catch (err) {
      console.error("Error fetching admissions:", err);
      setError("Admission তালিকা লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [patientsRes, roomsRes, doctorsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/rooms"),
        api.get("/doctors"),
      ]);
      setPatients(patientsRes.data);
      setRooms(roomsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      setError("Patient/Room/Doctor তালিকা লোড করা যায়নি।");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (a) => {
    setEditingId(a.admissionId);
    setForm({
      patientId: a.patientId ?? "",
      roomId: a.roomId ?? "",
      doctorId: a.doctorId ?? "",
      admissionDate: a.admissionDate ? a.admissionDate.substring(0, 10) : "",
      dischargeDate: a.dischargeDate ? a.dischargeDate.substring(0, 10) : "",
      reason: a.reason ?? "",
      status: a.status ?? "Admitted",
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- ভ্যালিডেশন: patientId/roomId/doctorId খালি থাকলে NaN/null হয়ে
    //     ব্যাকএন্ডে "$.patientId could not be converted to Int32" এরর দেয়।
    if (!form.patientId || !form.roomId || !form.doctorId) {
      setError("Patient, Room এবং Doctor অবশ্যই সিলেক্ট করতে হবে।");
      return;
    }

    const data = {
      patientId: Number(form.patientId),
      roomId: Number(form.roomId),
      doctorId: Number(form.doctorId),
      admissionDate: form.admissionDate || null,
      dischargeDate: form.dischargeDate || null,
      reason: form.reason,
      status: form.status,
    };

    console.log("SUBMITTING DATA:", data);

    try {
      if (editingId) {
        await api.put(`/admissions/${editingId}`, data);
      } else {
        await api.post("/admissions", data);
      }
      await fetchAdmissions();
      handleCancel();
    } catch (err) {
      console.error("Error saving admission:", err);
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const messages = Object.values(apiErrors).flat().join(" | ");
        setError(messages);
      } else {
        setError("Admission সেভ করা যায়নি।");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত এই Admission ডিলিট করতে চান?")) return;
    try {
      await api.delete(`/admissions/${id}`);
      await fetchAdmissions();
    } catch (err) {
      console.error("Error deleting admission:", err);
      setError("Admission ডিলিট করা যায়নি।");
    }
  };

  return (
    <div className="admission-list">
      <div className="page-header">
        <h2>Admissions</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add Admission
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="admission-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Patient</label>
            <select name="patientId" value={form.patientId} onChange={handleChange}>
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Room</label>
            <select name="roomId" value={form.roomId} onChange={handleChange}>
              <option value="">-- Select Room --</option>
              {rooms.map((r) => (
                <option key={r.roomId} value={r.roomId}>
                  {r.roomNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Doctor</label>
            <select name="doctorId" value={form.doctorId} onChange={handleChange}>
              <option value="">-- Select Doctor --</option>
              {doctors.map((d) => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={form.admissionDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Discharge Date</label>
            <input
              type="date"
              name="dischargeDate"
              value={form.dischargeDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Save"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Room</th>
              <th>Doctor</th>
              <th>Admission Date</th>
              <th>Discharge Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((a) => (
              <tr key={a.admissionId}>
                <td>{a.patientName || "-"}</td>
                <td>{a.roomNumber || "-"}</td>
                <td>{a.doctorName || "-"}</td>
                <td>{a.admissionDate ? a.admissionDate.substring(0, 10) : "-"}</td>
                <td>{a.dischargeDate ? a.dischargeDate.substring(0, 10) : "-"}</td>
                <td>{a.status}</td>
                <td>
                  <button className="btn btn-sm" onClick={() => handleEdit(a)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(a.admissionId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
