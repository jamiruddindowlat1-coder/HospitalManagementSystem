import "./Layout.css";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Hospital Management System</h2>
            <small>Healthcare Management Platform</small>
          </div>
          <div className="topbar-right">
            <NotificationBell />
            <div className="topbar-user">
              👤 <strong>Administrator</strong>
            </div>
          </div>
        </header>
        <section className="page-content">
          {children}
        </section>
      </main>
    </div>
  );
}