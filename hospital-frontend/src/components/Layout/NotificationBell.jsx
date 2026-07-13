import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCircleCheck, FaCirclePlus, FaPen, FaTrash, FaHospital } from "react-icons/fa6";
import { getRecentActivities } from "../../services/dashboardService";
import "./NotificationBell.css";

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function actionIcon(action) {
  switch (action) {
    case "Created": return <FaCirclePlus className="icon created" />;
    case "Updated": return <FaPen className="icon updated" />;
    case "Deleted": return <FaTrash className="icon deleted" />;
    case "Discharged": return <FaHospital className="icon discharged" />;
    default: return <FaCircleCheck className="icon" />;
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSeen, setLastSeen] = useState(() => localStorage.getItem("activityLastSeen") || null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const loadActivities = async () => {
    try {
      const data = await getRecentActivities(8);
      setActivities(data || []);
    } catch (error) {
      console.log("Notification load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = activities.filter(a => !lastSeen || new Date(a.createdAt) > new Date(lastSeen)).length;

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next && activities.length > 0) {
      const newest = activities[0].createdAt;
      localStorage.setItem("activityLastSeen", newest);
      setLastSeen(newest);
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button className="bell-btn" onClick={toggleOpen} aria-label="Notifications">
        <FaBell />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-dropdown">
          <div className="bell-dropdown-header">
            <span>Recent Activity</span>
          </div>

          <div className="bell-dropdown-list">
            {loading ? (
              <div className="bell-empty">Loading...</div>
            ) : activities.length === 0 ? (
              <div className="bell-empty">No recent activity.</div>
            ) : (
              activities.map((a, i) => (
                <div className="bell-item" key={i}>
                  {actionIcon(a.action)}
                  <div className="bell-item-text">
                    <p>{a.description}</p>
                    <span className="bell-item-meta">{a.userName || "System"} · {timeAgo(a.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bell-dropdown-footer">
            <button onClick={() => { setOpen(false); navigate("/activity-log"); }}>
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}