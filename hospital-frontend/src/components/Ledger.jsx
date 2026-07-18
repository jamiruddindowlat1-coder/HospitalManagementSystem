import React, { useEffect, useState } from "react";
import accountsService from "../services/accountsService";
import "./SharedList.css";

function Ledger() {
  const [entries, setEntries] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const [ledgerData, balanceData] = await Promise.all([
        accountsService.getLedger(),
        accountsService.getLedgerBalance(),
      ]);

      setEntries(Array.isArray(ledgerData) ? ledgerData : []);
      setBalance(balanceData);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Data load failed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((e) =>
    (e.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="page-container">

      <div className="header-box">
        <h2>📒 Ledger</h2>
      </div>

      <div className="count-box">
        Total Entries : {entries.length}
        {balance !== null && (
          <>
            {" "}&nbsp;|&nbsp; Current Balance : ৳
            {Number(
              typeof balance === "object"
                ? balance.balance ?? balance.currentBalance ?? 0
                : balance
            ).toLocaleString()}
          </>
        )}
      </div>

      {error && (
        <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 600 }}>
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Search by description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Running Balance</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No ledger entries found.</td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.ledgerEntryId}>
                  <td>
                    {entry.entryType === "Income" ? "🟢 " : "🔴 "}
                    {entry.entryType}
                  </td>
                  <td>{entry.description}</td>
                  <td>৳{Number(entry.amount).toLocaleString()}</td>
                  <td>{new Date(entry.entryDate).toLocaleDateString()}</td>
                  <td>৳{Number(entry.runningBalance).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Ledger;
