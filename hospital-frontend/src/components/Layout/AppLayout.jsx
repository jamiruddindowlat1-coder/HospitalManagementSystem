import "./Layout.css";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

export default function AppLayout({ children }) {
  const userRole = localStorage.getItem("role") || "User";
  const userName = localStorage.getItem("user") || userRole;

  return (
    <div className="app-layout">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div className="logo-text">HOSPITAL HMS</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "15px" }}>Hospital Management System</h2>
            <small style={{ opacity: 0.7, fontSize: "11px" }}>Healthcare Management Platform</small>
          </div>
        </div>
        <div className="topbar-right">
          <NotificationBell />
          <div className="topbar-user">
            👤 <strong>{userName}</strong>
            <span style={{ opacity: 0.6, fontSize: "11px" }}>({userRole})</span>
          </div>
        </div>
      </header>

      <div className="layout-body">
        <Sidebar />
        <main className="main-content-wide">
          <section className="page-content">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
