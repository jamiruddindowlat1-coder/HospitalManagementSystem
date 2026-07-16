import { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";

function UserManagement() {

    const emptyForm = {
        fullName: "",
        email: "",
        password: "",
        roleId: "",
        isActive: true
    };

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/users");
            setUsers(Array.isArray(response.data) ? response.data : []);
            setError("");
        } catch (error) {
            console.log("USER ERROR:", error.response || error);
            setError("User load failed");
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await api.get("/users/roles");
            setRoles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.log("ROLE ERROR:", error.response || error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowForm(false);
    };

    const handleEdit = (user) => {
        setForm({
            fullName: user.fullName || "",
            email: user.email || "",
            password: "",
            roleId: user.roleId || "",
            isActive: user.isActive
        });
        setEditId(user.userId);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("আপনি কি নিশ্চিত এই ইউজারটি ডিলিট করতে চান?")) return;
        try {
            await api.delete(`/users/${id}`);
            loadUsers();
        } catch (error) {
            console.log("DELETE ERROR:", error.response || error);
            setError("Delete failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                roleId: form.roleId,
                isActive: form.isActive
            };
            if (form.password) {
                payload.password = form.password;
            }

            if (editId) {
                await api.put(`/users/${editId}`, payload);
            } else {
                await api.post("/users", payload);
            }

            resetForm();
            loadUsers();
        } catch (error) {
            console.log("SUBMIT ERROR:", error.response || error);
            setError("Save failed");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredUsers = users.filter((u) => {
        const term = search.toLowerCase();
        return (
            (u.fullName || "").toLowerCase().includes(term) ||
            (u.email || "").toLowerCase().includes(term)
        );
    });

    if (loading) return <div className="list-container">লোড হচ্ছে...</div>;

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>ইউজার ম্যানেজমেন্ট</h2>
                <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
                    + নতুন ইউজার
                </button>
            </div>

            {error && <div className="error-banner">{error}</div>}

            <input
                type="text"
                placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{editId ? "ইউজার এডিট করুন" : "নতুন ইউজার যোগ করুন"}</h3>
                        <form onSubmit={handleSubmit}>
                            <label>পূর্ণ নাম</label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />

                            <label>ইমেইল</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                            <label>পাসওয়ার্ড {editId && "(খালি রাখলে অপরিবর্তিত থাকবে)"}</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                {...(!editId ? { required: true } : {})}
                            />

                            <label>রোল</label>
                            <select
                                name="roleId"
                                value={form.roleId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- রোল নির্বাচন করুন --</option>
                                {roles.map((role) => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                />
                                সক্রিয়
                            </label>

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? "সেভ হচ্ছে..." : "সেভ করুন"}
                                </button>
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    বাতিল
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>নাম</th>
                        <th>ইমেইল</th>
                        <th>রোল</th>
                        <th>স্ট্যাটাস</th>
                        <th>একশন</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                কোনো ইউজার পাওয়া যায়নি
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((user, idx) => (
                            <tr key={user.userId ?? idx}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.roleName || "-"}</td>
                                <td>
                                    <span className={user.isActive ? "badge-active" : "badge-inactive"}>
                                        {user.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                                        এডিট
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(user.userId)}>
                                        ডিলিট
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
