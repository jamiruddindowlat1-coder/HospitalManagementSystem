import { useLocation } from "react-router-dom";
import { usePermissions } from "./PermissionContext.jsx";

// Wrap a route's element with this, INSIDE ProtectedRoute + AppLayout, e.g.:
//   <Route path="/payroll" element={wrap(PayrollList)} />
// becomes handled automatically via path lookup - see App.jsx wrap() update.
export default function PermissionRoute({ children }) {
  const location = useLocation();
  const { loading, hasAccessForPath } = usePermissions();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  const allowed = hasAccessForPath(location.pathname);

  if (!allowed) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ color: "#ef4444" }}>Access Denied</h2>
        <p>You don't have permission to view this module.</p>
        <p>Contact your administrator if you believe this is a mistake.</p>
      </div>
    );
  }

  return children;
}
