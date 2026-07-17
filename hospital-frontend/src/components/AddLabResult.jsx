import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getPatients } from "../services/patientService";
import { getLabTests } from "../services/labTestService";
import "./SharedList.css";

const AddLabResult = () => {

    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        patientId: "",
        labTestId: "",
        result: "",
        remarks: "",
        status: "Pending",
    });


    const loadDropdownData = async () => {

        try {

            const patientData = await getPatients();
            const labTestData = await getLabTests();

            setPatients(patientData || []);
            setLabTests(labTestData || []);

        } catch (error) {

            console.log(error);
            alert("Dropdown data load করতে সমস্যা হয়েছে");

        }

    };


    useEffect(() => {

        loadDropdownData();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.patientId || !formData.labTestId) {
            alert("Patient এবং Lab Test দুটোই সিলেক্ট করতে হবে");
            return;
        }

        setSubmitting(true);

        try {

            await api.post("/LabResults", {
                patientId: Number(formData.patientId),
                labTestId: Number(formData.labTestId),
                result: formData.result,
                remarks: formData.remarks,
                status: formData.status,
            });

            alert("Lab Result created successfully");

            navigate("/lab-results");

        } catch (error) {

            console.log(error);
            alert("Failed to create lab result");

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>➕ Add Lab Result</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px auto" }}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Patient *</label>
                    <select
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        className="search-box"
                        required
                    >
                        <option value="">-- Select Patient --</option>
                        {patients.map((p) => (
                            <option key={p.id ?? p.patientId} value={p.id ?? p.patientId}>
                                {p.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Lab Test *</label>
                    <select
                        name="labTestId"
                        value={formData.labTestId}
                        onChange={handleChange}
                        className="search-box"
                        required
                    >
                        <option value="">-- Select Lab Test --</option>
                        {labTests.map((t) => (
                            <option key={t.id ?? t.labTestId} value={t.id ?? t.labTestId}>
                                {t.testName || t.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Result</label>
                    <input
                        type="text"
                        name="result"
                        value={formData.result}
                        onChange={handleChange}
                        className="search-box"
                        placeholder="e.g. Hemoglobin 14 g/dL, CBC Normal"
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Remarks</label>
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        className="search-box"
                        rows="3"
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="search-box"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        className="btn-add"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "💾 Save"}
                    </button>
                    <button
                        type="button"
                        className="btn-delete"
                        style={{ marginLeft: "10px" }}
                        onClick={() => navigate("/lab-results")}
                    >
                        ❌ Cancel
                    </button>
                </div>

            </form>

        </div>

    );

};

export default AddLabResult;