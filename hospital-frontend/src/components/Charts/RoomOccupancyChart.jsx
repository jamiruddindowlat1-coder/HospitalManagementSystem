import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function RoomOccupancyChart({ data = [] }) {
  return (
    <div className="dashboard-chart">
      <h3>🛏️ Room Occupancy</h3>
      <ResponsiveContainer width="100%" height={90}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="roomType" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="occupied" stackId="a" fill="#dc2626" />
          <Bar dataKey="available" stackId="a" fill="#15803d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
