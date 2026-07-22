import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "./ToastContext.jsx";
import "./SharedList.css";

function RolePermissionsPage() {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadPermissions(selectedRoleId);
    } else {
      setPermissions([]);
    }
  }, [selectedRoleId]);

  const loadRoles = async () => {
    try {
      const res = await api.get("/Roles");
      setRoles(res.data);
      if (res.data.length > 0) {
        setSelectedRoleId(String(res.data[0].roleId));
      }
    } catch (err) {
      toast.error("Failed to load roles.");
    }
  };

  const loadPermissions = async (roleId) => {
    setLoading(true);
    try {
      const res = await api.get(`/RolePermissions/role/${roleId}`);
      setPermissions(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setPermissions([]);
        toast.error("No permissions found for this role. Try seeding first.");
      } else {
        toast.error("Failed to load permissions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (permission) => {
    const updated = !permission.hasAccess;

    // Optimistic UI update
    setPermissions((prev) =>
      prev.map((p) =>
        p.rolePermissionId === permission.rolePermissionId
          ? { ...p, hasAccess: updated }
          : p
      )
    );

    try {
      await api.put(`/RolePermissions/${permission.rolePermissionId}`, {
        hasAccess: updated,
      });
      toast.success(`${permission.moduleName} access ${updated ? "enabled" : "disabled"}.`);
    } catch (err) {
      // Revert on failure
      setPermissions((prev) =>
        prev.map((p) =>
          p.rolePermissionId === permission.rolePermissionId
            ? { ...p, hasAccess: !updated }
            : p
        )
      );
      toast.error("Failed to update permission.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await api.post("/RolePermissions/seed");
      toast.success(res.data.message || "Seed complete.");
      if (selectedRoleId) {
        loadPermissions(selectedRoleId);
      }
    } catch (err) {
      toast.error("Seed failed.");
    } finally {
      setSeeding(false);
    }
  };

  const selectedRole = roles.find((r) => String(r.roleId) === String(selectedRoleId));

  return (
    <div className="shared-list-container">
      <div className="shared-list-header">
        <h2>Role Permissions</h2>
        <button
          className="btn btn-secondary"
          onClick={handleSeed}
          disabled={seeding}
        >
          {seeding ? "Seeding..." : "Seed Defaults"}
        </button>
      </div>

      <div className="filter-row" style={{ marginBottom: "1rem" }}>
        <label htmlFor="role-select" style={{ marginRight: "0.5rem" }}>
          Select Role:
        </label>
        <select
          id="role-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading permissions...</p>
      ) : permissions.length === 0 ? (
        <p>
          No permissions found for {selectedRole ? selectedRole.roleName : "this role"}.
          Click "Seed Defaults" to generate them.
        </p>
      ) : (
        <table className="shared-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.rolePermissionId}>
                <td>{permission.moduleName}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={permission.hasAccess}
                      onChange={() => handleToggle(permission)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RolePermissionsPage;
