import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";
import "./SharedList.css";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    departmentName: "",
    description: "",
    location: "",
    phone: "",
    status: "Active",
    departmentHead: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load Departments Error:", error);
      alert("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveDepartment = async (e) => {
    e.preventDefault();
    try {
      if (!form.departmentName.trim()) {
        alert("Department Name is required.");
        return;
      }

      if (editingId) {
        await updateDepartment(editingId, form);
        alert("Department Updated Successfully");
      } else {
        await createDepartment(form);
        alert("Department Added Successfully");
      }

      resetForm();
      loadDepartments();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editDepartment = (dept) => {
    setEditingId(dept.departmentId);
    setForm({
      departmentName: dept.departmentName,
      description: dept.description || "",
      location: dept.location || "",
      phone: dept.phone || "",
      status: dept.status || "Active",
      departmentHead: dept.departmentHead || "",
    });
  };

  const removeDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await deleteDepartment(id);
      alert("Department Deleted Successfully");
      loadDepartments();
    } catch (error) {
      console.error(error);
      alert("Delete Failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      departmentName: "",
      description: "",
      location: "",
      phone: "",
      status: "Active",
      departmentHead: "",
    });
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.departmentHead && d.departmentHead.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>🏥 Department Management</h2>
      </div>

      <div className="count-box">Total Departments: {departments.length}</div>

      <form onSubmit={saveDepartment} className="table-container" style={{ padding: "15px", marginBottom: "15px" }}>
        <h3>{editingId ? "✏️ Edit Department" : "➕ Add New Department"}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <input
            type="text"
            name="departmentName"
            placeholder="Department Name"
            value={form.departmentName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="departmentHead"
            placeholder="Department Head (e.g. Dr. John)"
            value={form.departmentHead}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location / Building / Ward"
            value={form.location}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Extension Phone / Contact"
            value={form.phone}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", maxWidth: "100%" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn-add">
            {editingId ? "Update Department" : "Save Department"}
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
          placeholder="🔍 Search departments..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading departments...</p>
      ) : (
        <div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Head</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Doctors Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7">No Departments Found.</td>
                  </tr>
                ) : (
                  currentItems.map((d) => (
                    <tr key={d.departmentId}>
                      <td><strong>{d.departmentName}</strong></td>
                      <td>{d.departmentHead || "N/A"}</td>
                      <td>{d.location || "N/A"}</td>
                      <td>{d.phone || "N/A"}</td>
                      <td>
                        <span className={d.status === "Active" ? "badge-active" : "badge-inactive"}>
                          {d.status}
                        </span>
                      </td>
                      <td>👨‍⚕️ {d.doctors?.length ?? 0}</td>
                      <td>
                        <button className="btn-edit" onClick={() => editDepartment(d)}>
                          ✏️ Edit
                        </button>
                        <button className="btn-delete" onClick={() => removeDepartment(d.departmentId)}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px", alignItems: "center" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{ padding: "5px 10px", borderRadius: "5px", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{ padding: "5px 10px", borderRadius: "5px", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DepartmentList;