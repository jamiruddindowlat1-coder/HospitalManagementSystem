import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#FF5722', '#00BCD4'];

function IncomeByCategory({ data, loading }) {
  if (loading) return <div className="loading-spinner">লোড হচ্ছে...</div>;
  if (!data || data.length === 0) return <p>কোনো ডেটা নেই</p>;

  return (
    <div className="chart-container">
      <h3>Income by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            dataKey="totalAmount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) => `${entry.category}: ৳${entry.amount}`}
            label={(entry) => `${entry.category}: ৳${entry.totalAmount.toLocaleString()}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncomeByCategory;