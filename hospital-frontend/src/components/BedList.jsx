import { useEffect, useState } from "react";
import bedService from "../services/bedService";
import roomService from "../services/roomService";
import "./SharedList.css";

function BedList() {
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    roomId: "",
    bedNumber: "",
    occupied: false,
    cleaningStatus: "Clean",
    status: "Available",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const bedData = await bedService.getBeds();
      setBeds(Array.isArray(bedData) ? bedData : []);
      const roomData = await roomService.getRooms();
      setRooms(Array.isArray(roomData) ? roomData : []);
    } catch (error) {
      console.error("Load Beds Error:", error);
      alert("Failed to load beds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveBed = async (e) => {
    e.preventDefault();
    try {
      if (!form.roomId) {
        alert("Please select a room.");
        return;
      }
      if (!form.bedNumber.trim()) {
        alert("Bed Number is required.");
        return;
      }

      const payload = {
        ...form,
        roomId: parseInt(form.roomId),
      };

      if (editingId) {
        await bedService.updateBed(editingId, payload);
        alert("Bed Updated Successfully");
      } else {
        await bedService.createBed(payload);
        alert("Bed Added Successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editBed = (bed) => {
    setEditingId(bed.bedId);
    setForm({
      roomId: bed.roomId.toString(),
      bedNumber: bed.bedNumber,
      occupied: bed.occupied,
      cleaningStatus: bed.cleaningStatus || "Clean",
      status: bed.status || "Available",
    });
  };

  const deleteBed = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bed?")) return;
    try {
      await bedService.deleteBed(id);
      alert("Bed Deleted Successfully");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      roomId: "",
      bedNumber: "",
      occupied: false,
      cleaningStatus: "Clean",
      status: "Available",
    });
  };

  const filteredBeds = beds.filter(
    (b) =>
      b.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>🛏️ Bed Management</h2>
      </div>

      <div className="count-box">Total Beds: {beds.length}</div>

      <form onSubmit={saveBed} className="table-container">
        <h3>{editingId ? "✏️ Edit Bed" : "➕ Add New Bed"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <select name="roomId" value={form.roomId} onChange={handleChange} required>
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.roomId} value={r.roomId}>
                Room {r.roomNumber} ({r.roomType})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="bedNumber"
            placeholder="Bed Number (e.g. Bed-A)"
            value={form.bedNumber}
            onChange={handleChange}
            required
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Reserved">Reserved</option>
          </select>

          <select name="cleaningStatus" value={form.cleaningStatus} onChange={handleChange}>
            <option value="Clean">Clean</option>
            <option value="Dirty">Dirty</option>
            <option value="InProgress">In Progress</option>
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              name="occupied"
              checked={form.occupied}
              onChange={handleChange}
              style={{ width: "auto", margin: 0 }}
            />
            Occupied
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn-add">
            {editingId ? "Update Bed" : "Save Bed"}
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
          placeholder="🔍 Search beds..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading beds...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bed Number</th>
                <th>Room Number</th>
                <th>Status</th>
                <th>Cleaning Status</th>
                <th>Occupancy Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeds.length === 0 ? (
                <tr>
                  <td colSpan="6">No Beds Found.</td>
                </tr>
              ) : (
                filteredBeds.map((b) => (
                  <tr key={b.bedId}>
                    <td>{b.bedNumber}</td>
                    <td>Room {b.roomNumber}</td>
                    <td>
                      <span className={b.status === "Available" ? "badge-active" : "badge-inactive"}>
                        {b.status}
                      </span>
                    </td>
                    <td>{b.cleaningStatus}</td>
                    <td>{b.occupied ? "🔴 Occupied" : "🟢 Available"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => editBed(b)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteBed(b.bedId)}>
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

export default BedList;
