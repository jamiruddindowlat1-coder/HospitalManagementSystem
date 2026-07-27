import "./StatCard.css";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
}) {
  return (
    <div
      className="stat-card"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
      }}
    >
      <div
        className="stat-icon"
        style={{
          background: "rgba(255,255,255,.25)",
        }}
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