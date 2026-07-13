import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#be123c", "#0891b2", "#ca8a04"];

export default function MedicineStockChart({ data = [] }) {
  return (
    <div style={{ width: "100%", height: 350, marginTop: "30px" }}>
      <h3>💊 Medicine Stock</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="stock"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}