import "./StatCard.css";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
}) {
  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div className="stat-content">
        <h4>{title}</h4>
        <h2>{value}</h2>
      </div>
    </div>
  );
}