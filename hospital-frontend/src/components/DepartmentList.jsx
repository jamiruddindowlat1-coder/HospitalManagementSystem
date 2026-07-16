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
  });

  const [editingId, setEditingId] = useState(null);

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

  const saveDepartment = async () => {
    try {
      if (!form.departmentName.trim()) {
        alert("Department Name is required.");
        return;
      }

      if (editingId) {
        await updateDepartment(editingId, form);
        alert("Department Updated");
      } else {
        await createDepartment(form);
        alert("Department Added");
      }

      resetForm();
      loadDepartments();
    } catch (error) {
      console.error(error);
      alert("Save Failed");
    }
  };

  const editDepartment = (department) => {
    setEditingId(department.departmentId);

    setForm({
      departmentName: department.departmentName,
      description: department.description || "",
    });
  };

  const removeDepartment = async (id) => {
    if (!window.confirm("Delete Department?")) return;

    try {
      await deleteDepartment(id);
      alert("Department Deleted");
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
    });
  };

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>🏥 Department Management</h2>
      </div>

      <div className="table-container">
        <input
          type="text"
          name="departmentName"
          placeholder="Department Name"
          value={form.departmentName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button className="btn-add" onClick={saveDepartment}>
          {editingId ? "Update" : "Save"}
        </button>

        {editingId && (
          <button onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {departments.length === 0 ? (
            <p>No Departments Found.</p>
          ) : (
            departments.map((d) => (
              <div className="card" key={d.departmentId}>
                <h3>{d.departmentName}</h3>

                <p>{d.description}</p>

                <p>👨‍⚕️ Doctors: {d.doctors?.length ?? 0}</p>

                <button
                  className="btn-edit"
                  onClick={() => editDepartment(d)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() => removeDepartment(d.departmentId)}
                >
                  🗑 Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default DepartmentList;