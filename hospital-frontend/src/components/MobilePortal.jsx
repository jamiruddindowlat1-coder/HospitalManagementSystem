import React, { useEffect, useState } from "react";
import api from "../services/api";

const MobilePortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, patients, beds, pharmacy
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, bRes, prRes, mRes, aRes] = await Promise.all([
        api.get("/Patients"),
        api.get("/Beds"),
        api.get("/Pharmacy/prescriptions"),
        api.get("/Medicines"),
        api.get("/Appointments")
      ]);
      setPatients(pRes.data);
      setBeds(bRes.data);
      setPrescriptions(prRes.data);
      setMedicines(mRes.data);
      setAppointments(aRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScan = () => {
    setScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setScanning(false);
      // Pick a random patient to simulate a successful wristband scan
      if (patients.length > 0) {
        const randomPatient = patients[Math.floor(Math.random() * patients.length)];
        setScannedResult(randomPatient);
      }
    }, 2200);
  };

  if (loading) {
    return <div className="page-container"><h3>Loading Mobile App Portal...</h3></div>;
  }

  // Filter patients
  const filteredPatients = patients.filter(p => 
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
      
      {/* Smartphone Mockup container */}
      <div className="phone-wrapper" style={{
        width: "360px",
        height: "740px",
        background: "#0f172a",
        borderRadius: "40px",
        border: "12px solid #1e293b",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden"
      }}>
        
        {/* Speaker Notch */}
        <div style={{
          width: "120px",
          height: "22px",
          backgroundColor: "#1e293b",
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ width: "40px", height: "4px", backgroundColor: "#0f172a", borderRadius: "2px" }} />
        </div>

        {/* Status Bar */}
        <div style={{
          height: "36px",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: "12px",
          color: "#94a3b8",
          backgroundColor: "#1e293b",
          zIndex: 5,
          paddingBottom: "4px"
        }}>
          <span>09:41</span>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <span>📶</span>
            <span>📶</span>
            <span>🔋 100%</span>
          </div>
        </div>

        {/* Screen Content Area */}
        <div className="phone-screen" style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column"
        }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "bold" }}>Metro Health Portal</span>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>📱 HMS Mobile</h2>
            </div>
            <button 
              onClick={handleScan}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                background: "#0f766e",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
              }}
              title="Scan Patient Wristband"
            >
              📷
            </button>
          </div>

          {/* Scanner view overlay if scanning */}
          {scanning && (
            <div style={{
              position: "absolute",
              top: "36px", left: 0, right: 0, bottom: "56px",
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 99,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff"
            }}>
              <div style={{
                width: "200px",
                height: "200px",
                border: "3px solid #10b981",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#10b981",
                  top: 0,
                  animation: "scan-animation 2s linear infinite"
                }} />
              </div>
              <h3 style={{ marginTop: "20px" }}>Scanning Wristband...</h3>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Point camera at patient QR/Barcode</p>
              
              <style>{`
                @keyframes scan-animation {
                  0% { top: 0; }
                  50% { top: 100%; }
                  100% { top: 0; }
                }
              `}</style>
            </div>
          )}

          {/* Scanned Result display */}
          {scannedResult && (
            <div style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid #10b981",
              fontSize: "13px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>✅ Wristband Scanned</strong>
                <button onClick={() => setScannedResult(null)} style={{ background: "none", border: "none", color: "#15803d", cursor: "pointer", fontWeight: "bold" }}>✕</button>
              </div>
              <div style={{ marginTop: "4px" }}>
                Patient: <strong>{scannedResult.fullName}</strong><br />
                Age/Gender: {scannedResult.age} / {scannedResult.gender}<br />
                Blood Group: {scannedResult.bloodGroup || "N/A"}<br />
                History: {scannedResult.medicalHistory || "None"}
              </div>
            </div>
          )}

          {/* Tab Renderers */}
          {activeTab === "dashboard" && (
            <div>
              {/* Welcome Card */}
              <div style={{
                background: "linear-gradient(135deg, #0f766e, #0d9488)",
                color: "#fff",
                padding: "16px",
                borderRadius: "16px",
                marginBottom: "15px",
                boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.2)"
              }}>
                <h4 style={{ margin: 0, opacity: 0.9 }}>Welcome back,</h4>
                <h3 style={{ margin: "5px 0 0 0", fontSize: "18px" }}>On-duty Staff Member</h3>
                <span style={{ fontSize: "11px", display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "10px", marginTop: "10px" }}>
                  Ward Station 3A
                </span>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <div style={{ background: "#fff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Occupied Beds</span>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1e3a8a", marginTop: "4px" }}>
                    {beds.filter(b => b.occupied).length}
                  </div>
                </div>
                <div style={{ background: "#fff", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>Active Prescriptions</span>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#0d9488", marginTop: "4px" }}>
                    {prescriptions.length}
                  </div>
                </div>
              </div>

              {/* Alerts & Low Stock Banner */}
              <h4 style={{ margin: "15px 0 8px 0", color: "#334155" }}>Critical Notifications</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {medicines.filter(m => m.stockQuantity < 10).slice(0, 2).map(m => (
                  <div key={m.medicineId} style={{ background: "#fffbeb", borderLeft: "4px solid #f59e0b", padding: "10px", borderRadius: "6px", fontSize: "12px" }}>
                    ⚠️ Low stock: <strong>{m.medicineName}</strong> has only {m.stockQuantity} units left.
                  </div>
                ))}
                {beds.filter(b => b.cleaningStatus === "Dirty").slice(0, 1).map(b => (
                  <div key={b.bedId} style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "10px", borderRadius: "6px", fontSize: "12px" }}>
                    🧼 Bed <strong>{b.bedNumber}</strong> (Room {b.roomNumber}) needs cleaning.
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "patients" && (
            <div>
              <input
                type="text"
                placeholder="Search patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "15px" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredPatients.map(p => (
                  <div key={p.patientId} style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: "bold", color: "#1e293b" }}>{p.fullName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                      ID: #{p.patientId} | Age: {p.age} | Blood: {p.bloodGroup || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "beds" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {beds.map(b => (
                  <div key={b.bedId} style={{ 
                    background: b.occupied ? "#fef2f2" : "#f0fdf4", 
                    border: "1px solid #e2e8f0", 
                    padding: "10px", 
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "75px"
                  }}>
                    <span style={{ fontWeight: "bold", fontSize: "13px" }}>🛏️ {b.bedNumber}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Room {b.roomNumber}</span>
                    <span style={{ 
                      fontSize: "10px", 
                      fontWeight: "bold",
                      color: b.occupied ? "#ef4444" : "#10b981",
                      alignSelf: "flex-end",
                      marginTop: "5px"
                    }}>
                      {b.occupied ? "Occupied" : "Available"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pharmacy" && (
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#334155" }}>Pending Prescriptions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {prescriptions.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b", fontSize: "12px" }}>No prescriptions to dispense.</p>
                ) : (
                  prescriptions.map(pr => (
                    <div key={pr.medicalRecordId} style={{ background: "#fff", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>{pr.patientName}</div>
                      <div style={{ color: "#0d9488", fontSize: "13px", fontWeight: "bold", margin: "4px 0" }}>
                        💊 {pr.prescription}
                      </div>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>By: {pr.doctorName}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Navigation bottom bar */}
        <div style={{
          height: "56px",
          borderTop: "1px solid #1e293b",
          backgroundColor: "#1e293b",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: "4px"
        }}>
          {[
            { id: "dashboard", label: "Home", icon: "🏠" },
            { id: "patients", label: "Patients", icon: "👥" },
            { id: "beds", label: "Beds", icon: "🛏️" },
            { id: "pharmacy", label: "Meds", icon: "💊" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === t.id ? "#2dd4bf" : "#94a3b8",
                fontSize: "11px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 8px"
              }}
            >
              <span style={{ fontSize: "16px", marginBottom: "2px" }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MobilePortal;
