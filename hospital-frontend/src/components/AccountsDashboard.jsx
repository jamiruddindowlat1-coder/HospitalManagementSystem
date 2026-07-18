import MonthlyFinancialChart from "./MonthlyFinancialChart";
import React, { useEffect, useState } from "react";
import accountsService from "../services/accountsService";
import "./SharedList.css";

function AccountsDashboard() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [summaryData, recentData] = await Promise.all([
        accountsService.getAccountsSummary(),
        accountsService.getAccountsRecent(),
      ]);

      setSummary(summaryData);
      setRecent(Array.isArray(recentData) ? recentData : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Data load failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  const totalIncome = summary?.totalIncome ?? summary?.income ?? 0;
  const totalExpense = summary?.totalExpense ?? summary?.expense ?? 0;
  const netBalance =
    summary?.netBalance ?? summary?.balance ?? (totalIncome - totalExpense);
  const totalSalary = summary?.totalSalary ?? summary?.salaryPaid ?? 0;
  const todayIncome = summary?.todayIncome ?? 0;
  const todayExpense = summary?.todayExpense ?? 0;

  return (
    <div className="page-container">

      <div className="header-box">
        <h2>📊 Accounts Dashboard</h2>
      </div>

      {error && (
        <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          margin: "15px 0",
        }}
      >
        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Total Income</p>
          <h3 style={{ margin: "5px 0", color: "#16a34a" }}>
            ৳{Number(totalIncome).toLocaleString()}
          </h3>
        </div>

        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Total Expense</p>
          <h3 style={{ margin: "5px 0", color: "#dc2626" }}>
            ৳{Number(totalExpense).toLocaleString()}
          </h3>
        </div>

        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Salary Paid</p>
          <h3 style={{ margin: "5px 0", color: "#d97706" }}>
            ৳{Number(totalSalary).toLocaleString()}
          </h3>
        </div>

        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Net Balance</p>
          <h3 style={{ margin: "5px 0", color: "#2563eb" }}>
            ৳{Number(netBalance).toLocaleString()}
          </h3>
        </div>

        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Today Income</p>
          <h3 style={{ margin: "5px 0", color: "#16a34a" }}>
            ৳{Number(todayIncome).toLocaleString()}
          </h3>
        </div>

        <div className="table-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#6b7280" }}>Today Expense</p>
          <h3 style={{ margin: "5px 0", color: "#dc2626" }}>
            ৳{Number(todayExpense).toLocaleString()}
          </h3>
        </div>
      </div>

      <MonthlyFinancialChart />

      <div className="table-container">
        <h3 style={{ textAlign: "center" }}>Recent Activity</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No recent activity.</td>
              </tr>
            ) : (
              recent.map((r, idx) => (
                <tr key={r.id ?? idx}>
                  <td>{r.type ?? r.entryType}</td>
                  <td>{r.description}</td>
                  <td>৳{Number(r.amount ?? 0).toLocaleString()}</td>
                  <td>
                    {r.date
                      ? new Date(r.date).toLocaleDateString()
                      : r.entryDate
                      ? new Date(r.entryDate).toLocaleDateString()
                      : "N/A"}
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

export default AccountsDashboard;
