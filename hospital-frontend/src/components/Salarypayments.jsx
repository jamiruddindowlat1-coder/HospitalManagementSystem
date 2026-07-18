import React, { useEffect, useState } from "react";
import accountsService from "../services/accountsService";
import "./SharedList.css";

function SalaryPayments() {
  const [paymentList, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    staffType: "Doctor",
    staffId: "",
    staffName: "",
    amount: "",
    paymentMonth: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    status: "Paid",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const data = await accountsService.getAllSalaryPayments();
      setPaymentList(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Data load failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      staffType: "Doctor",
      staffId: "",
      staffName: "",
      amount: "",
      paymentMonth: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      status: "Paid",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        staffType: formData.staffType,
        staffId: Number(formData.staffId),
        staffName: formData.staffName,
        amount: Number(formData.amount),
        paymentMonth: formData.paymentMonth,
        paymentDate: formData.paymentDate,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (editingId) {
        await accountsService.updateSalaryPayment(editingId, payload);
      } else {
        await accountsService.createSalaryPayment(payload);
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      setError("Save failed.");
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment.salaryPaymentId);
    setShowForm(true);
    setFormData({
      staffType: payment.staffType,
      staffId: payment.staffId,
      staffName: payment.staffName,
      amount: payment.amount,
      paymentMonth: payment.paymentMonth,
      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      status: payment.status,
      notes: payment.notes || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this salary payment?")) return;

    try {
      await accountsService.deleteSalaryPayment(id);
      loadData();
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    }
  };

  const filteredPayments = paymentList.filter((p) =>
    (p.staffName || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPaid = paymentList.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="page-container">

      <div className="header-box">
        <h2>🧾 Salary Payments</h2>
      </div>

      <div className="count-box">
        Total Payments : {paymentList.length} &nbsp;|&nbsp; Total Amount : ৳{totalPaid.toLocaleString()}
      </div>

      {error && (
        <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          className="btn-add"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingId(null);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "✖️ Close Form" : "➕ Add Salary Payment"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by staff name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="table-container" style={{ maxWidth: "500px", margin: "15px auto" }}>
          <h3 style={{ textAlign: "center" }}>
            {editingId ? "✏️ Edit Salary Payment" : "➕ New Salary Payment"}
          </h3>

          <label>Staff Type</label>
          <select
            name="staffType"
            value={formData.staffType}
            onChange={handleChange}
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Admin">Admin</option>
            <option value="Other">Other</option>
          </select>

          <label>Staff ID</label>
          <input
            type="number"
            name="staffId"
            placeholder="Staff ID"
            value={formData.staffId}
            onChange={handleChange}
            required
          />

          <label>Staff Name</label>
          <input
            name="staffName"
            placeholder="Staff Name"
            value={formData.staffName}
            onChange={handleChange}
            required
          />

          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <label>Payment Month</label>
          <input
            name="paymentMonth"
            placeholder="e.g. July 2026"
            value={formData.paymentMonth}
            onChange={handleChange}
            required
          />

          <label>Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <label>Notes (optional)</label>
          <input
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button type="submit" className="btn-add">
              {editingId ? "💾 Update" : "💾 Save"}
            </button>
            &nbsp;
            <button type="button" className="btn-delete" onClick={resetForm}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>No salary payments found.</td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.salaryPaymentId}>
                  <td>{payment.staffName}</td>
                  <td>{payment.staffType}</td>
                  <td>৳{Number(payment.amount).toLocaleString()}</td>
                  <td>{payment.paymentMonth}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(payment)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(payment.salaryPaymentId)}>🗑 Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SalaryPayments;
