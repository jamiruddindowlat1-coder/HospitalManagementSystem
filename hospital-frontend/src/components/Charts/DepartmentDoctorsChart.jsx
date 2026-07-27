import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function DepartmentDoctorsChart({ data = [] }) {
  return (
    <div className="dashboard-chart">
      <h3>👨‍⚕️ Department Wise Doctors</h3>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#9333ea" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
