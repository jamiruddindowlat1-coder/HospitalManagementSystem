import React, { useState, useEffect } from "react";
import api from "../services/api"; // path ঠিক করে নিন আপনার প্রজেক্ট অনুযায়ী

const emptyForm = {
  source: "",
  description: "",
  amount: "",
  incomeDate: "",
  referenceNumber: "",
};

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Income");
      setIncomes(res.data || []);
    } catch (err) {
      console.error("Income load failed:", err);
      alert("ইনকাম লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
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
    if (!form.source || !form.amount || !form.incomeDate) {
      alert("Source, Amount, Date আবশ্যক");
      return;
    }

    const payload = {
      source: form.source,
      description: form.description,
      amount: parseFloat(form.amount),
      incomeDate: new Date(form.incomeDate).toISOString(),
      referenceNumber: form.referenceNumber,
    };

    try {
      if (editingId) {
        // body তে incomeId লাগে না, path parameter এই ID যায়
        await api.put(`/Income/${editingId}`, payload);
        alert("ইনকাম আপডেট হয়েছে");
      } else {
        await api.post("/Income", payload);
        alert("নতুন ইনকাম যোগ হয়েছে");
      }
      resetForm();
      fetchIncomes();
    } catch (err) {
      console.error("Save failed:", err);
      alert("সেভ করতে সমস্যা হয়েছে");
    }
  };

  const handleEdit = (item) => {
    setForm({
      source: item.source || "",
      description: item.description || "",
      amount: item.amount || "",
      incomeDate: item.incomeDate ? item.incomeDate.split("T")[0] : "",
      referenceNumber: item.referenceNumber || "",
    });
    setEditingId(item.incomeId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই ইনকাম এন্ট্রি ডিলিট করতে চান?")) return;
    try {
      await api.delete(`/Income/${id}`);
      alert("ডিলিট হয়েছে");
      fetchIncomes();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Income Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Income
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1rem", padding: "1rem" }}>
          <h3>{editingId ? "Edit Income" : "New Income"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
            <input
              name="source"
              placeholder="Source (e.g. Billing, Pharmacy)"
              value={form.source}
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
              name="incomeDate"
              type="date"
              value={form.incomeDate}
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
        ) : incomes.length === 0 ? (
          <p>কোনো ইনকাম এন্ট্রি নেই।</p>
        ) : (
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((item) => (
                <tr key={item.incomeId}>
                  <td>{item.source}</td>
                  <td>{item.description}</td>
                  <td>৳{Number(item.amount).toLocaleString()}</td>
                  <td>{new Date(item.incomeDate).toLocaleDateString()}</td>
                  <td>{item.referenceNumber}</td>
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(item)} title="Edit">
                      ✏
                    </button>
                    <button className="btn-icon" onClick={() => handleDelete(item.incomeId)} title="Delete">
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
