import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";

const PharmacyDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dispense Form State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [dispenseMessage, setDispenseMessage] = useState("");
  const [dispenseError, setDispenseError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prescRes, medRes, patRes] = await Promise.all([
        api.get("/Pharmacy/prescriptions"),
        api.get("/Medicines"),
        api.get("/Patients")
      ]);
      setPrescriptions(prescRes.data);
      setMedicines(medRes.data);
      setPatients(patRes.data);
    } catch (error) {
      console.error("Failed to load pharmacy data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDispense = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedMedicineId || quantity <= 0) {
      setDispenseError("Please select a patient, medicine, and enter a valid quantity.");
      return;
    }

    setSubmitting(true);
    setDispenseError("");
    setDispenseMessage("");

    try {
      const response = await api.post("/Pharmacy/dispense", {
        patientId: parseInt(selectedPatientId),
        medicineId: parseInt(selectedMedicineId),
        quantity: parseInt(quantity)
      });
      setDispenseMessage(response.data.message || "Medicine dispensed successfully!");
      // Reload data to reflect stock and invoice updates
      loadData();
      // Reset form quantity
      setQuantity(1);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Dispensation failed. Please check stock levels.";
      setDispenseError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockMedicines = medicines.filter(m => m.stockQuantity < 10);

  if (loading) {
    return <div className="page-container"><h3>Loading Pharmacy Workflow...</h3></div>;
  }

  return (
    <div className="page-container">
      <div className="header-box" style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}>
        <h2>💊 Pharmacy & Dispensing Workflow</h2>
      </div>

      {/* Stats and alerts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        
        {/* Dispense Panel Card */}
        <div className="data-card" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ color: "#0f766e", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px", marginTop: 0 }}>
            ➕ Dispense Medicine
          </h3>
          <form onSubmit={handleDispense} style={{ marginTop: "15px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}
                required
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.fullName} (ID: #{p.patientId})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>Select Medicine *</label>
              <select
                value={selectedMedicineId}
                onChange={(e) => setSelectedMedicineId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}
                required
              >
                <option value="">-- Choose Medicine --</option>
                {medicines.map(m => (
                  <option key={m.medicineId} value={m.medicineId}>
                    {m.medicineName} (Stock: {m.stockQuantity} | Price: {m.unitPrice} BDT)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>Quantity *</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}
                required
              />
            </div>

            {dispenseError && (
              <div style={{ padding: "10px", background: "#fef2f2", color: "#b91c1c", borderRadius: "6px", marginBottom: "10px", fontSize: "14px" }}>
                ⚠️ {dispenseError}
              </div>
            )}

            {dispenseMessage && (
              <div style={{ padding: "10px", background: "#f0fdf4", color: "#16a34a", borderRadius: "6px", marginBottom: "10px", fontSize: "14px" }}>
                ✅ {dispenseMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-add"
              style={{ width: "100%", padding: "12px", background: "#0d9488", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {submitting ? "Processing..." : "Dispense & Bill"}
            </button>
          </form>
        </div>

        {/* Alerts & Stock Card */}
        <div className="data-card" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ color: "#b91c1c", borderBottom: "2px solid #f1f5f9", paddingBottom: "8px", marginTop: 0 }}>
            ⚠️ Low Stock Alert (Stock &lt; 10)
          </h3>
          {lowStockMedicines.length === 0 ? (
            <div style={{ padding: "15px", textAlign: "center", color: "#64748b" }}>
              All medicines are fully stocked!
            </div>
          ) : (
            <div style={{ maxHeight: "280px", overflowY: "auto", marginTop: "10px" }}>
              {lowStockMedicines.map(m => (
                <div key={m.medicineId} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #f1f5f9", background: m.stockQuantity === 0 ? "#fef2f2" : "transparent" }}>
                  <span style={{ fontWeight: "600" }}>{m.medicineName}</span>
                  <span style={{ color: m.stockQuantity === 0 ? "#ef4444" : "#f59e0b", fontWeight: "bold" }}>
                    {m.stockQuantity} units left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescriptions List Section */}
      <div className="header-box" style={{ marginTop: "30px", background: "linear-gradient(135deg, #1e293b, #0f172a)" }}>
        <h3>📝 Active Patient Prescriptions</h3>
      </div>
      
      <div className="table-container" style={{ marginTop: "15px" }}>
        <table className="data-table" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Diagnosis</th>
              <th>Prescribed Medicines</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No active prescriptions found.</td>
              </tr>
            ) : (
              prescriptions.map(p => (
                <tr key={p.medicalRecordId}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: "bold" }}>{p.patientName}</td>
                  <td>{p.doctorName}</td>
                  <td>{p.diagnosis || "N/A"}</td>
                  <td style={{ color: "#0d9488", fontWeight: "600" }}>{p.prescription}</td>
                  <td>
                    <button
                      className="btn-edit"
                      style={{ background: "#0d9488" }}
                      onClick={() => {
                        setSelectedPatientId(p.patientId);
                        // Auto-fill medicine if matching name is found
                        const matchedMed = medicines.find(m => 
                          p.prescription?.toLowerCase().includes(m.medicineName?.toLowerCase())
                        );
                        if (matchedMed) {
                          setSelectedMedicineId(matchedMed.medicineId);
                        }
                        window.scrollTo({ top: 250, behavior: 'smooth' });
                      }}
                    >
                      Fill Presc.
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
};

export default PharmacyDashboard;
