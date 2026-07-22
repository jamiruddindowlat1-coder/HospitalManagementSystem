import { useState, useEffect } from "react";
import employeeService from "../services/employeeService";
import { useToast } from "./ToastContext.jsx";
import "./SharedList.css";

function EmployeeList() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    departmentId: "",
    designation: "",
    phone: "",
    email: "",
    address: "",
    nid: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      departmentId: "",
      designation: "",
      phone: "",
      email: "",
      address: "",
      nid: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      joiningDate: "",
      salary: "",
      status: "Active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        departmentId: parseInt(formData.departmentId),
        designation: formData.designation,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        nid: formData.nid,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        joiningDate: formData.joiningDate,
        salary: parseFloat(formData.salary),
        status: formData.status,
      };
      if (editingId) {
        await employeeService.update(editingId, payload);
        toast.success("Employee updated");
      } else {
        await employeeService.create(payload);
        toast.success("Employee added");
      }
      resetForm();
      loadEmployees();
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      fullName: emp.fullName || "",
      departmentId: emp.departmentId || "",
      designation: emp.designation || "",
      phone: emp.phone || "",
      email: emp.email || "",
      address: emp.address || "",
      nid: emp.nid || "",
      emergencyContactName: emp.emergencyContactName || "",
      emergencyContactPhone: emp.emergencyContactPhone || "",
      joiningDate: emp.joiningDate ? emp.joiningDate.split("T")[0] : "",
      salary: emp.salary || "",
      status: emp.status || "Active",
    });
    setEditingId(emp.employeeId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await employeeService.delete(id);
      toast.success("Employee deleted");
      loadEmployees();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Employees (HR)</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {showForm && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input name="departmentId" type="number" placeholder="Department ID" value={formData.departmentId} onChange={handleChange} required />
            <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <input name="nid" placeholder="NID" value={formData.nid} onChange={handleChange} />
            <input name="emergencyContactName" placeholder="Emergency Contact Name" value={formData.emergencyContactName} onChange={handleChange} />
            <input name="emergencyContactPhone" placeholder="Emergency Contact Phone" value={formData.emergencyContactPhone} onChange={handleChange} />
            <input name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required />
            <input name="salary" type="number" step="0.01" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? "Update Employee" : "Save Employee"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No employees found</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>{emp.fullName}</td>
                  <td>{emp.departmentName || emp.departmentId}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.salary}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(emp)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(emp.employeeId)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeList;

