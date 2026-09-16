import { useState } from "react";
import "./Layout.css";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { FaBars } from "react-icons/fa";

export default function AppLayout({ children }) {
  const userRole = localStorage.getItem("role") || "User";
  const userName = localStorage.getItem("user") || userRole;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className={`app-layout sidebar-wrapper ${isMobileOpen ? 'mobile-open' : ''}`}>
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '0 5px', alignItems: 'center' }}
          >
            <FaBars />
          </button>
          <img src="/shms_logo.jpg" alt="SHMS Logo" style={{ height: "40px", borderRadius: "4px" }} />
          <div>
            <h2 style={{ margin: 0, fontSize: "15px" }}>Sayan Hospital Management System</h2>
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
