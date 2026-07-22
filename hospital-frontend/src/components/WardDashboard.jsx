import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";

const WardDashboard = () => {
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admit Modal State
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [targetBed, setTargetBed] = useState(null);
  const [admitPatientId, setAdmitPatientId] = useState("");
  const [admitDoctorId, setAdmitDoctorId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bedsRes, roomsRes, patientsRes, doctorsRes, admissionsRes] = await Promise.all([
        api.get("/Beds"),
        api.get("/Rooms"),
        api.get("/Patients"),
        api.get("/Doctors"),
        api.get("/Admissions")
      ]);
      setBeds(bedsRes.data);
      setRooms(roomsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setAdmissions(admissionsRes.data);
    } catch (error) {
      console.error("Failed to load ward dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate statistics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.occupied || b.status === "Occupied").length;
  const cleaningBeds = beds.filter(b => b.cleaningStatus === "Dirty" || b.cleaningStatus === "InProgress").length;
  const availableBeds = totalBeds - occupiedBeds - cleaningBeds;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  // Group beds by room
  const roomsMap = {};
  rooms.forEach(r => {
    roomsMap[r.roomId] = {
      ...r,
      beds: []
    };
  });
  // Add fallback rooms if beds refer to rooms not in rooms list
  beds.forEach(b => {
    if (!roomsMap[b.roomId]) {
      roomsMap[b.roomId] = {
        roomId: b.roomId,
        roomNumber: b.roomNumber || `Room ${b.roomId}`,
        roomType: "General",
        pricePerDay: 0,
        beds: []
      };
    }
    roomsMap[b.roomId].beds.push(b);
  });

  const handleOpenAdmit = (bed) => {
    setTargetBed(bed);
    setAdmitPatientId("");
    setAdmitDoctorId("");
    setShowAdmitModal(true);
  };

  const handleAdmitSubmit = async (e) => {
    e.preventDefault();
    if (!admitPatientId || !admitDoctorId || !targetBed) return;

    setSubmitting(true);
    try {
      // 1. Create admission record
      await api.post("/Admissions", {
        patientId: parseInt(admitPatientId),
        roomId: targetBed.roomId,
        doctorId: parseInt(admitDoctorId),
        admissionDate: new Date().toISOString(),
        status: "Admitted"
      });

      // 2. Update bed occupancy
      await api.put(`/Beds/${targetBed.bedId}`, {
        bedId: targetBed.bedId,
        roomId: targetBed.roomId,
        bedNumber: targetBed.bedNumber,
        occupied: true,
        cleaningStatus: "Clean",
        status: "Occupied"
      });

      setShowAdmitModal(false);
      loadData();
    } catch (error) {
      console.error("Admission failed:", error);
      alert("Failed to admit patient. Make sure patient/doctor details are correct.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async (bed) => {
    // Find active admission for this room
    const activeAd = admissions.find(a => a.roomId === bed.roomId && a.status === "Admitted");
    if (!activeAd) {
      // If no admission record found, just reset bed status
      if (window.confirm("No active admission record found. Reset bed status to Available?")) {
        await resetBedStatus(bed);
      }
      return;
    }

    if (!window.confirm(`Discharge patient ${activeAd.patientName} from Bed ${bed.bedNumber}?`)) {
      return;
    }

    try {
      // 1. Discharge in Admissions
      await api.put(`/Admissions/${activeAd.admissionId}`, {
        patientId: activeAd.patientId,
        roomId: activeAd.roomId,
        doctorId: activeAd.doctorId,
        admissionDate: activeAd.admissionDate,
        dischargeDate: new Date().toISOString(),
        status: "Discharged"
      });

      // 2. Reset bed status
      await resetBedStatus(bed);
    } catch (error) {
      console.error("Discharge failed:", error);
      alert("Discharge action failed.");
    }
  };

  const resetBedStatus = async (bed) => {
    await api.put(`/Beds/${bed.bedId}`, {
      bedId: bed.bedId,
      roomId: bed.roomId,
      bedNumber: bed.bedNumber,
      occupied: false,
      cleaningStatus: "Clean",
      status: "Available"
    });
    loadData();
  };

  const toggleCleaning = async (bed) => {
    const nextStatus = bed.cleaningStatus === "Clean" ? "Dirty" : "Clean";
    try {
      await api.put(`/Beds/${bed.bedId}`, {
        bedId: bed.bedId,
        roomId: bed.roomId,
        bedNumber: bed.bedNumber,
        occupied: bed.occupied,
        cleaningStatus: nextStatus,
        status: nextStatus === "Dirty" ? "Cleaning" : "Available"
      });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="page-container"><h3>Loading Ward Dashboard...</h3></div>;
  }

  return (
    <div className="page-container">
      <div className="header-box" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
        <h2>🏥 Ward & Bed Occupancy Dashboard</h2>
      </div>

      {/* KPI Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginTop: "20px" }}>
        <div className="data-card" style={{ textAlign: "center", padding: "15px", borderLeft: "4px solid #3b82f6" }}>
          <h4 style={{ margin: 0, color: "#64748b" }}>Total Beds</h4>
          <h2 style={{ fontSize: "28px", margin: "5px 0", color: "#1e3a8a" }}>{totalBeds}</h2>
        </div>
        <div className="data-card" style={{ textAlign: "center", padding: "15px", borderLeft: "4px solid #ef4444" }}>
          <h4 style={{ margin: 0, color: "#64748b" }}>Occupied</h4>
          <h2 style={{ fontSize: "28px", margin: "5px 0", color: "#ef4444" }}>{occupiedBeds}</h2>
        </div>
        <div className="data-card" style={{ textAlign: "center", padding: "15px", borderLeft: "4px solid #10b981" }}>
          <h4 style={{ margin: 0, color: "#64748b" }}>Available</h4>
          <h2 style={{ fontSize: "28px", margin: "5px 0", color: "#10b981" }}>{availableBeds}</h2>
        </div>
        <div className="data-card" style={{ textAlign: "center", padding: "15px", borderLeft: "4px solid #f59e0b" }}>
          <h4 style={{ margin: 0, color: "#64748b" }}>Occupancy Rate</h4>
          <h2 style={{ fontSize: "28px", margin: "5px 0", color: "#f59e0b" }}>{occupancyRate}%</h2>
        </div>
      </div>

      {/* Ward grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "25px" }}>
        {Object.values(roomsMap).map(room => (
          <div key={room.roomId} className="data-card" style={{ padding: "15px", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "15px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#1e293b" }}>Room {room.roomNumber}</h3>
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase" }}>{room.roomType} | {room.pricePerDay} BDT/day</span>
              </div>
              <span style={{ 
                padding: "3px 8px", 
                borderRadius: "12px", 
                fontSize: "11px", 
                fontWeight: "bold",
                backgroundColor: room.isOccupied ? "#fee2e2" : "#dcfce7",
                color: room.isOccupied ? "#ef4444" : "#10b981"
              }}>
                {room.isOccupied ? "Occupied" : "Vacant"}
              </span>
            </div>

            {/* Beds in room */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {room.beds.length === 0 ? (
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>No beds added to this room.</span>
              ) : (
                room.beds.map(bed => {
                  const isOccupied = bed.occupied || bed.status === "Occupied";
                  const isDirty = bed.cleaningStatus === "Dirty" || bed.cleaningStatus === "InProgress";
                  
                  // Find occupant
                  const ad = admissions.find(a => a.roomId === room.roomId && a.status === "Admitted");
                  
                  return (
                    <div 
                      key={bed.bedId} 
                      style={{ 
                        flex: "1 1 calc(50% - 10px)", 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "8px", 
                        padding: "10px",
                        background: isOccupied ? "#fff5f5" : isDirty ? "#fffbeb" : "#f0fdf4",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "110px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", fontSize: "14px", color: "#1e293b" }}>🛏️ {bed.bedNumber}</span>
                        <span style={{ 
                          width: "8px", 
                          height: "8px", 
                          borderRadius: "50%", 
                          backgroundColor: isOccupied ? "#ef4444" : isDirty ? "#f59e0b" : "#10b981" 
                        }} />
                      </div>
                      
                      <div style={{ margin: "5px 0", fontSize: "11px", color: "#64748b" }}>
                        {isOccupied ? (
                          <>
                            <div>Patient: <strong>{ad?.patientName || "Admitted"}</strong></div>
                            <div>Doc: {ad?.doctorName || "N/A"}</div>
                          </>
                        ) : isDirty ? (
                          <div style={{ color: "#b45309", fontWeight: "bold" }}>⚠️ Needs Cleaning</div>
                        ) : (
                          <div style={{ color: "#15803d" }}>Available</div>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                        {isOccupied ? (
                          <button 
                            onClick={() => handleDischarge(bed)}
                            style={{ flex: 1, padding: "4px", fontSize: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Discharge
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleOpenAdmit(bed)}
                            style={{ flex: 1, padding: "4px", fontSize: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            disabled={isDirty}
                          >
                            Admit
                          </button>
                        )}
                        <button 
                          onClick={() => toggleCleaning(bed)}
                          style={{ padding: "4px 8px", fontSize: "10px", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          🧼
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admit Modal */}
      {showAdmitModal && targetBed && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ marginTop: 0, color: "#1e3a8a" }}>Admit Patient to Bed {targetBed.bedNumber}</h3>
            <form onSubmit={handleAdmitSubmit} style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>Select Patient *</label>
                <select
                  value={admitPatientId}
                  onChange={(e) => setAdmitPatientId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px" }}>Assign Doctor *</label>
                <select
                  value={admitDoctorId}
                  onChange={(e) => setAdmitDoctorId(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", marginTop: "5px" }}
                  required
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>{d.fullName} ({d.specialization})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button 
                  type="button" 
                  onClick={() => setShowAdmitModal(false)}
                  style={{ padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#f8fafc", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  style={{ padding: "8px 20px", background: "#1e3a8a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {submitting ? "Admitting..." : "Admit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardDashboard;
