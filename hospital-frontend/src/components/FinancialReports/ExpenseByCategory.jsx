import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ExpenseByCategory({ categoryData, topExpenses, loading }) {
  if (loading) return <div className="loading-spinner">লোড হচ্ছে...</div>;

  return (
    <div className="chart-container">
      <h3>Expense by Category</h3>
      {categoryData && categoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#FF5722" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>কোনো ডেটা নেই</p>
      )}

      <h4 style={{ marginTop: '20px' }}>Top Expenses</h4>
      {topExpenses && topExpenses.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {topExpenses.map((exp, idx) => (
              <tr key={idx}>
                <td>{exp.description}</td>
                <td>{exp.category}</td>
                <td>৳ {exp.amount?.toLocaleString()}</td>
               <td>
  {exp.expenseDate
    ? new Date(exp.expenseDate).toLocaleDateString()
    : "-"}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>কোনো তথ্য নেই</p>
      )}
    </div>
  );
}

export default ExpenseByCategory;