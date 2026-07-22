import "./Layout.css";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="logo-text" style={{ fontSize: "24px", fontWeight: "900", background: "rgba(255,255,255,0.15)", padding: "5px 15px", borderRadius: "10px", letterSpacing: "1px" }}>
            HOSPITAL HMS
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px" }}>Hospital Management System</h2>
            <small style={{ opacity: 0.8 }}>Healthcare Management Platform</small>
          </div>
        </div>
        <div className="topbar-right">
          <NotificationBell />
          <div className="topbar-user">
            👤 <strong>Administrator</strong>
          </div>
        </div>
      </header>

      {/* Top Navbar */}
      <Sidebar />

      <main className="main-content-wide">
        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  );
}