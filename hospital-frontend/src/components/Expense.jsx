import React, { useState, useEffect } from "react";
import api from "../services/api"; // path ঠিক করে নিন আপনার প্রজেক্ট অনুযায়ী

const emptyForm = {
  id: null,
  category: "",
  description: "",
  amount: "",
  expenseDate: "",
  referenceNumber: "",
};

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Expense");
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Expense load failed:", err);
      alert("এক্সপেন্স লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.expenseDate) {
      alert("Category, Amount, Date আবশ্যক");
      return;
    }

    const payload = {
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      expenseDate: new Date(form.expenseDate).toISOString(),
      referenceNumber: form.referenceNumber,
    };

    try {
      if (editingId) {
        // API এর PUT body তে id/expenseId লাগে না, শুধু path parameter এই ID যায়
        await api.put(`/Expense/${editingId}`, payload);
        alert("এক্সপেন্স আপডেট হয়েছে");
      } else {
        await api.post("/Expense", payload);
        alert("নতুন এক্সপেন্স যোগ হয়েছে");
      }
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error("Save failed:", err);
      alert("সেভ করতে সমস্যা হয়েছে");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.expenseId,
      category: item.category || "",
      description: item.description || "",
      amount: item.amount || "",
      expenseDate: item.expenseDate ? item.expenseDate.split("T")[0] : "",
      referenceNumber: item.referenceNumber || "",
    });
    setEditingId(item.expenseId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই এক্সপেন্স এন্ট্রি ডিলিট করতে চান?")) return;
    try {
      await api.delete(`/Expense/${id}`);
      alert("ডিলিট হয়েছে");
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Expense Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Expense
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
          <h3>{editingId ? "Edit Expense" : "New Expense"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            <input
              name="category"
              placeholder="Category (e.g. Medicine, Utility)"
              value={form.category}
              onChange={handleChange}
            />
            <input
              name="referenceNumber"
              placeholder="Reference Number"
              value={form.referenceNumber}
              onChange={handleChange}
            />
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />
            <input
              name="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={{ gridColumn: "span 2" }}
            />
          </div>
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingId ? "Update" : "Save"}
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p>কোনো এক্সপেন্স এন্ট্রি নেই।</p>
        ) : (
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.expenseId}>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>৳{Number(item.amount).toLocaleString()}</td>
                  <td>{new Date(item.expenseDate).toLocaleDateString()}</td>
                  <td>{item.referenceNumber}</td>
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(item)} title="Edit">
                      ✏
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(item.expenseId)} title="Delete">
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
