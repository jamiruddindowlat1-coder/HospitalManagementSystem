import React from 'react';

function ProfitLossSummary({ data, loading }) {
  if (loading) return <div className="loading-spinner">লোড হচ্ছে...</div>;
  if (!data) return null;

  return (
    <div className="summary-cards">
      <div className="card card-income">
        <h4>Total Income</h4>
        <p className="amount">৳ {data.totalIncome?.toLocaleString()}</p>
      </div>
      <div className="card card-expense">
        <h4>Total Expense</h4>
        <p className="amount">৳ {data.totalExpense?.toLocaleString()}</p>
      </div>
     <div className={`card ${(data.netProfitLoss ?? data.netProfit) >= 0 ? 'card-profit' : 'card-loss'}`}>
        <h4>Net Profit</h4>
        <p className="amount">৳ {(data.netProfitLoss ?? data.netProfit)?.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default ProfitLossSummary;