import { useEffect, useState } from "react";
import api from "../services/api";
import {
    createRadiologyTest,
    updateRadiologyTest,
    deleteRadiologyTest,
} from "../services/radiologyService";
import "./SharedList.css";

const TEST_TYPES = ["X-Ray", "MRI", "CT Scan", "Ultrasound (USG)", "ECG", "Echocardiography"];
const STATUS_OPTIONS = ["Pending", "Completed", "Cancelled"];

const emptyForm = {
    patientId: "",
    doctorId: "",
    testType: "X-Ray",
    requestDate: new Date().toISOString().split("T")[0],
    reportDate: "",
    findings: "",
    status: "Pending",
    imageUrl: "",
};

function RadiologyList() {
    const [tests, setTests] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const load = async () => {
        try {
            setLoading(true);
            const [testsRes, patientsRes, doctorsRes] = await Promise.all([
                api.get("/RadiologyTests"),
                api.get("/Patients"),
                api.get("/Doctors"),
            ]);
            setTests(testsRes.data || []);
            setPatients(patientsRes.data || []);
            setDoctors(doctorsRes.data || []);
        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddForm = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            patientId: item.patientId,
            doctorId: item.doctorId,
            testType: item.testType,
            requestDate: item.requestDate ? item.requestDate.split("T")[0] : "",
            reportDate: item.reportDate ? item.reportDate.split("T")[0] : "",
            findings: item.findings || "",
            status: item.status || "Pending",
            imageUrl: item.imageUrl || "",
        });
        setShowForm(true);
    };

    const cancelForm = () => {
        setEditingItem(null);
        setFormData(emptyForm);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                patientId: parseInt(formData.patientId),
                doctorId: parseInt(formData.doctorId),
                requestDate: formData.requestDate || new Date().toISOString(),
                reportDate: formData.reportDate || null,
            };
            if (editingItem) {
                const id = editingItem.radiologyTestId ?? editingItem.id;
                await updateRadiologyTest(id, payload);
                setMessage("✅ Radiology Test updated successfully");
            } else {
                await createRadiologyTest(payload);
                setMessage("✅ Radiology Test created successfully");
            }
            cancelForm();
            load();
        } catch (err) {
            console.error(err);
            setMessage("❌ Operation failed. Please try again.");
        }
        setTimeout(() => setMessage(""), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Radiology Test?")) return;
        try {
            await deleteRadiologyTest(id);
            setMessage("✅ Radiology Test deleted successfully");
            load();
        } catch {
            setMessage("❌ Failed to delete");
        }
        setTimeout(() => setMessage(""), 3000);
    };

    const getStatusBadge = (status) => {
        const map = { Pending: "badge-warning", Completed: "badge-success", Cancelled: "badge-danger" };
        return map[status] || "badge-secondary";
    };

    // Patient/Doctor মডেলে FullName একটাই ফিল্ড — firstName/lastName নেই
    const getPatientName = (id) => {
        const p = patients.find((x) => x.patientId === id || x.id === id);
        return p ? (p.fullName || p.name || "—") : "—";
    };

    const getDoctorName = (id) => {
        const d = doctors.find((x) => x.doctorId === id || x.id === id);
        if (!d) return "—";
        const name = d.fullName || d.name || "";
        return name ? (name.startsWith("Dr.") ? name : `Dr. ${name}`) : "—";
    };

    const filtered = tests.filter((t) => {
        const q = search.toLowerCase();
        return (
            t.testType?.toLowerCase().includes(q) ||
            t.status?.toLowerCase().includes(q) ||
            getPatientName(t.patientId).toLowerCase().includes(q) ||
            getDoctorName(t.doctorId).toLowerCase().includes(q)
        );
    });

    return (
        <div className="shared-list-page">
            {/* Header */}
            <div className="list-header">
                <div className="list-header-left">
                    <h2>🩻 Radiology Tests</h2>
                    <p>Manage X-Ray, MRI, CT Scan, Ultrasound, ECG & Echocardiography</p>
                </div>
                <button className="btn-add" onClick={openAddForm}>
                    + Add New Test
                </button>
            </div>

            {/* Message */}
            {message && <div className="alert-message">{message}</div>}

            {/* Search */}
            <div className="list-controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search by patient, doctor, test type or status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="record-count">Total: {filtered.length} record(s)</span>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
                <div className="form-card">
                    <h3>{editingItem ? "Edit Radiology Test" : "Add New Radiology Test"}</h3>
                    <form onSubmit={handleSubmit} className="shared-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Patient *</label>
                                <select name="patientId" value={formData.patientId} onChange={handleChange} required>
                                    <option value="">-- Select Patient --</option>
                                    {patients.map((p) => (
                                        <option key={p.patientId ?? p.id} value={p.patientId ?? p.id}>
                                            {p.fullName || p.name || `Patient #${p.patientId ?? p.id}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Doctor *</label>
                                <select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map((d) => {
                                        const name = d.fullName || d.name || `Doctor #${d.doctorId ?? d.id}`;
                                        return (
                                            <option key={d.doctorId ?? d.id} value={d.doctorId ?? d.id}>
                                                {name.startsWith("Dr.") ? name : `Dr. ${name}`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Test Type *</label>
                                <select name="testType" value={formData.testType} onChange={handleChange} required>
                                    {TEST_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} required>
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Request Date *</label>
                                <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Report Date</label>
                                <input type="date" name="reportDate" value={formData.reportDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Findings / Report Details</label>
                            <textarea
                                name="findings"
                                value={formData.findings}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Enter report findings..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Image URL (Optional)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/scan.jpg"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">
                                {editingItem ? "Update" : "Save"}
                            </button>
                            <button type="button" className="btn-cancel" onClick={cancelForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="loading-spinner">⏳ Loading...</div>
            ) : (
                <div className="table-wrapper">
                    <table className="shared-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Test Type</th>
                                <th>Request Date</th>
                                <th>Report Date</th>
                                <th>Status</th>
                                <th>Findings</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="no-data">
                                        No Radiology Tests found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, idx) => {
                                    const id = item.radiologyTestId ?? item.id;
                                    return (
                                        <tr key={id}>
                                            <td>{idx + 1}</td>
                                            <td>{getPatientName(item.patientId)}</td>
                                            <td>{getDoctorName(item.doctorId)}</td>
                                            <td>
                                                <span className="badge-type">🩻 {item.testType}</span>
                                            </td>
                                            <td>
                                                {item.requestDate
                                                    ? new Date(item.requestDate).toLocaleDateString("en-GB")
                                                    : "—"}
                                            </td>
                                            <td>
                                                {item.reportDate
                                                    ? new Date(item.reportDate).toLocaleDateString("en-GB")
                                                    : <span className="text-muted">—</span>}
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="findings-cell">
                                                {item.findings
                                                    ? item.findings.length > 60
                                                        ? item.findings.substring(0, 60) + "..."
                                                        : item.findings
                                                    : <span className="text-muted">—</span>}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => startEdit(item)}
                                                        title="Edit"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(id)}
                                                        title="Delete"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RadiologyList;
