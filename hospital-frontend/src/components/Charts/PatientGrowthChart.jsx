import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PatientGrowthChart({ data = [] }) {
  return (
    <div className="dashboard-chart">
      <h3>📈 Patient Growth</h3>
      <ResponsiveContainer width="100%" height={90}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="patients" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
