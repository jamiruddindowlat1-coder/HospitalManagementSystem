import { useEffect, useState } from "react";
import roomService from "../services/roomService";
import { getDepartments } from "../services/departmentService";
import "./SharedList.css";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "General",
    isOccupied: false,
    pricePerDay: "",
    floor: "",
    status: "Available",
    departmentId: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const roomData = await roomService.getRooms();
      setRooms(Array.isArray(roomData) ? roomData : []);
      const deptData = await getDepartments();
      setDepartments(Array.isArray(deptData) ? deptData : []);
    } catch (error) {
      console.error("Load Rooms Error:", error);
      alert("Failed to load rooms.");
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

  const saveRoom = async (e) => {
    e.preventDefault();
    try {
      if (!form.roomNumber.trim()) {
        alert("Room Number is required.");
        return;
      }
      if (!form.pricePerDay || isNaN(form.pricePerDay)) {
        alert("Valid Price Per Day is required.");
        return;
      }

      const payload = {
        ...form,
        pricePerDay: parseFloat(form.pricePerDay),
        departmentId: form.departmentId ? parseInt(form.departmentId) : null,
      };

      if (editingId) {
        await roomService.updateRoom(editingId, payload);
        alert("Room Updated Successfully");
      } else {
        await roomService.createRoom(payload);
        alert("Room Added Successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editRoom = (room) => {
    setEditingId(room.roomId);
    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      isOccupied: room.isOccupied,
      pricePerDay: room.pricePerDay,
      floor: room.floor || "",
      status: room.status || "Available",
      departmentId: room.departmentId ? room.departmentId.toString() : "",
    });
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await roomService.deleteRoom(id);
      alert("Room Deleted Successfully");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      roomNumber: "",
      roomType: "General",
      isOccupied: false,
      pricePerDay: "",
      floor: "",
      status: "Available",
      departmentId: "",
    });
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.departmentName &&
        r.departmentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>🚪 Room Management</h2>
      </div>

      <div className="count-box">Total Rooms: {rooms.length}</div>

      <form onSubmit={saveRoom} className="table-container">
        <h3>{editingId ? "✏️ Edit Room" : "➕ Add New Room"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number (e.g. 101)"
            value={form.roomNumber}
            onChange={handleChange}
            required
          />

          <select name="roomType" value={form.roomType} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Cabin">Cabin</option>
            <option value="ICU">ICU</option>
            <option value="CCU">CCU</option>
            <option value="NICU">NICU</option>
            <option value="Operation Theater">Operation Theater</option>
            <option value="Emergency">Emergency</option>
          </select>

          <input
            type="number"
            name="pricePerDay"
            placeholder="Price Per Day"
            value={form.pricePerDay}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="floor"
            placeholder="Floor (e.g. 1st Floor)"
            value={form.floor}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Reserved">Reserved</option>
          </select>

          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
          >
            <option value="">Select Department (Optional)</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              name="isOccupied"
              checked={form.isOccupied}
              onChange={handleChange}
              style={{ width: "auto", margin: 0 }}
            />
            Currently Occupied
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn-add">
            {editingId ? "Update Room" : "Save Room"}
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
          placeholder="🔍 Search rooms..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading rooms...</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room No</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Price / Day</th>
                <th>Department</th>
                <th>Status</th>
                <th>Occupancy</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="8">No Rooms Found.</td>
                </tr>
              ) : (
                filteredRooms.map((r) => (
                  <tr key={r.roomId}>
                    <td>{r.roomNumber}</td>
                    <td>{r.roomType}</td>
                    <td>{r.floor}</td>
                    <td>৳ {r.pricePerDay}</td>
                    <td>{r.departmentName || "N/A"}</td>
                    <td>
                      <span className={r.status === "Available" ? "badge-active" : "badge-inactive"}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.isOccupied ? "🔴 Occupied" : "🟢 Free"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => editRoom(r)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteRoom(r.roomId)}>
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

export default RoomList;
