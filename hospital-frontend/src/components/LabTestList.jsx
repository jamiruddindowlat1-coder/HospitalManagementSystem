import { useEffect, useState } from "react";
import { getLabTests, createLabTest, updateLabTest, deleteLabTest } from "../services/labTestService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import "./SharedList.css";
import { useToast } from "./ToastContext.jsx";
function LabTestList() {
const toast = useToast();
    const emptyForm = {
        patientId: "",
        doctorId: "",
        testName: "",
        testType: "",
        status: "Pending",
        orderedDate: "",
        resultDate: "",
        result: "",
        notes: ""
    };

    const [labTests, setLabTests] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const [testData, patientData, doctorData] = await Promise.all([
                getLabTests(),
                getPatients(),
                getDoctors()
            ]);

            setLabTests(Array.isArray(testData) ? testData : []);
            setPatients(Array.isArray(patientData) ? patientData : []);
            setDoctors(Array.isArray(doctorData) ? doctorData : []);

            setError("");
        } catch (error) {
            console.log("LAB TEST ERROR:", error.response || error);
            setError("Lab Test load failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const payload = {
                patientId: Number(form.patientId),
                doctorId: Number(form.doctorId),
                testName: form.testName,
                testType: form.testType,
                status: form.status,
                orderedDate: form.orderedDate || new Date().toISOString(),
                resultDate: form.resultDate || null,
                result: form.result,
                notes: form.notes
            };

            if (editId) {
                await updateLabTest(editId, payload);
            } else {
                await createLabTest(payload);
            }

            resetForm();
            loadData();
        } catch (error) {
            console.log("SAVE ERROR:", error.response || error);
           toast.error("Save Failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (test) => {
        setEditId(test.labTestId);

        setForm({
            patientId: test.patientId || "",
            doctorId: test.doctorId || "",
            testName: test.testName || "",
            testType: test.testType || "",
            status: test.status || "Pending",
            orderedDate: test.orderedDate ? test.orderedDate.substring(0, 10) : "",
            resultDate: test.resultDate ? test.resultDate.substring(0, 10) : "",
            result: test.result || "",
            notes: test.notes || ""
        });

        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this lab test?")) return;

        try {
            await deleteLabTest(id);
            loadData();
        } catch (error) {
            console.log("DELETE ERROR:", error.response || error);
           toast.error("Delete Failed");
        }
    };

    const filteredTests = labTests.filter((t) =>
        (t.testName || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.patientName || "").toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <h3>Loading...</h3>;

    return (
        <div className="page-container">

            <div className="header-box">
                <h2>Lab Test Management</h2>
            </div>

            <div className="count-box">
                Total Lab Tests : {labTests.length}
            </div>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <div style={{ textAlign: "center" }}>
                <button
                    className="btn-add"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    Add Lab Test
                </button>
            </div>

            <input
                className="search-box"
                placeholder="Search by test name or patient"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {showForm && (
                <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "20px auto" }}>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Patient *</label>
                        <select
                            name="patientId"
                            value={form.patientId}
                            onChange={handleChange}
                            className="search-box"
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.patientId} value={p.patientId}>
                                    {p.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Doctor *</label>
                        <select
                            name="doctorId"
                            value={form.doctorId}
                            onChange={handleChange}
                            className="search-box"
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d.doctorId} value={d.doctorId}>
                                    {d.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Test Name *</label>
                        <input
                            type="text"
                            name="testName"
                            value={form.testName}
                            onChange={handleChange}
                            className="search-box"
                            placeholder="e.g. Complete Blood Count"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Test Type</label>
                        <input
                            type="text"
                            name="testType"
                            value={form.testType}
                            onChange={handleChange}
                            className="search-box"
                            placeholder="e.g. Blood Test"
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="search-box"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Ordered Date</label>
                        <input
                            type="date"
                            name="orderedDate"
                            value={form.orderedDate}
                            onChange={handleChange}
                            className="search-box"
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Result Date</label>
                        <input
                            type="date"
                            name="resultDate"
                            value={form.resultDate}
                            onChange={handleChange}
                            className="search-box"
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Result</label>
                        <textarea
                            name="result"
                            value={form.result}
                            onChange={handleChange}
                            className="search-box"
                            rows="3"
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            className="search-box"
                            rows="2"
                        />
                    </div>

                    <div style={{ textAlign: "center" }}>
                        <button type="submit" className="btn-add" disabled={submitting}>
                            {submitting ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="btn-delete"
                            style={{ marginLeft: "10px" }}
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            )}

            <div className="table-container">

                <table className="data-table" width="100%">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Test Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Ordered Date</th>
                            <th>Result Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTests.length === 0 ? (
                            <tr>
                                <td colSpan="9">No Lab Test Found</td>
                            </tr>
                        ) : (
                            filteredTests.map((test) => (
                                <tr key={test.labTestId}>

                                    <td>{test.labTestId}</td>

                                    <td>{test.patientName || "-"}</td>

                                    <td>{test.doctorName || "-"}</td>

                                    <td>{test.testName}</td>

                                    <td>{test.testType || "-"}</td>

                                    <td>{test.status}</td>

                                    <td>
                                        {test.orderedDate
                                            ? new Date(test.orderedDate).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td>
                                        {test.resultDate
                                            ? new Date(test.resultDate).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn-add"
                                            onClick={() => handleEdit(test)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            style={{ marginLeft: "5px" }}
                                            onClick={() => handleDelete(test.labTestId)}
                                        >
                                            Delete
                                        </button>
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

export default LabTestList;