import React, { useState } from 'react';

function LedgerAdvancedFilter({ ledgerData, loading, onFilterChange }) {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleApply = () => {
    onFilterChange({ type, category });
  };

  return (
    <div className="ledger-filter">
      <div className="filter-row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">সব ধরন</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Category লিখুন"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleApply}>
          ফিল্টার করুন
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">লোড হচ্ছে...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>বিবরণ</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData && ledgerData.length > 0 ? (
              ledgerData.map((item, idx) => (
                <tr key={idx}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`badge ${item.type === 'Income' ? 'badge-success' : 'badge-danger'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>৳ {item.amount?.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5">কোনো তথ্য পাওয়া যায়নি</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LedgerAdvancedFilter;