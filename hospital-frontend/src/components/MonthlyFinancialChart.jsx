import React, { useState, useEffect } from "react";
import api from "../services/api";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function MonthlyFinancialChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get("/AccountsDashboard/monthly");
        const { income = [], expense = [], salary = [] } = res.data || {};

        const keyOf = (item) => `${item.year}-${item.month}`;
        const map = new Map();

        const upsert = (item, field) => {
          const key = keyOf(item);
          const existing = map.get(key) || {
            year: item.year,
            month: item.month,
            income: 0,
            expense: 0,
            salary: 0,
          };
          existing[field] = item.total;
          map.set(key, existing);
        };

        income.forEach((i) => upsert(i, "income"));
        expense.forEach((i) => upsert(i, "expense"));
        salary.forEach((i) => upsert(i, "salary"));

        const merged = Array.from(map.values())
          .sort((a, b) => a.year - b.year || a.month - b.month)
          .map((item) => ({
            ...item,
            label: `${monthNames[item.month - 1]} ${item.year}`,
          }));

        setChartData(merged);
      } catch (err) {
        console.error("Monthly chart data load failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ padding: "1.5rem" }}>
        <p>Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ padding: "1.5rem" }}>
        <p>চার্ট ডেটা লোড করতে সমস্যা হয়েছে।</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card" style={{ padding: "1.5rem" }}>
        <p>কোনো মাসিক ডেটা পাওয়া যায়নি।</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...chartData.flatMap((d) => [d.income, d.expense, d.salary]),
    1
  );

  const chartHeight = 260;
  const barWidth = 22;
  const groupGap = 40;
  const groupWidth = barWidth * 3 + 12;
  const svgWidth = Math.max(chartData.length * (groupWidth + groupGap), 400);

  const scaleHeight = (value) => (value / maxValue) * (chartHeight - 40);

  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>Monthly Financial Overview</h3>

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ width: 12, height: 12, background: "#2ecc71", display: "inline-block", borderRadius: 2 }} />
          Income
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ width: 12, height: 12, background: "#e74c3c", display: "inline-block", borderRadius: 2 }} />
          Expense
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ width: 12, height: 12, background: "#3498db", display: "inline-block", borderRadius: 2 }} />
          Salary
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg width={svgWidth} height={chartHeight + 30} style={{ minWidth: "100%" }}>
          <line x1={0} y1={chartHeight - 20} x2={svgWidth} y2={chartHeight - 20} stroke="#e5e7eb" strokeWidth={1} />

          {chartData.map((d, idx) => {
            const groupX = idx * (groupWidth + groupGap) + 20;
            const baseY = chartHeight - 20;

            const bars = [
              { value: d.income, color: "#2ecc71" },
              { value: d.expense, color: "#e74c3c" },
              { value: d.salary, color: "#3498db" },
            ];

            return (
              <g key={idx}>
                {bars.map((bar, barIdx) => {
                  const h = scaleHeight(bar.value);
                  const x = groupX + barIdx * (barWidth + 4);
                  const y = baseY - h;
                  return (
                    <g key={barIdx}>
                      <rect x={x} y={y} width={barWidth} height={h} fill={bar.color} rx={3} />
                      {bar.value > 0 && (
                        <text x={x + barWidth / 2} y={y - 6} fontSize="10" textAnchor="middle" fill="#374151">
                          {bar.value >= 1000 ? `${(bar.value / 1000).toFixed(0)}k` : bar.value}
                        </text>
                      )}
                    </g>
                  );
                })}
                <text x={groupX + groupWidth / 2 - 6} y={chartHeight} fontSize="12" textAnchor="middle" fill="#6b7280">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}