import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(
    searchParams.get("token") || ""
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    console.log("Reset Request:", {
      token,
      newPassword,
    });

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      console.log("Reset Success:", response.data);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(
        "Reset Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        "Invalid or expired reset token."
      );

    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="login-wrapper">
        <h2>Password Reset Successful</h2>
        <p>Redirecting to login...</p>
      </div>
    );
  }


  return (
    <div className="login-wrapper">

      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} className="login-form">

        <div className="form-group">
          <label>Reset Token</label>

          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste reset token"
            required
          />
        </div>


        <div className="form-group">
          <label>New Password</label>

          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>


        <div className="form-group">
          <label>Confirm New Password</label>

          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>


        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) =>
              setShowPassword(e.target.checked)
            }
          />
          {" "}Show Password
        </label>


        {error && (
          <p className="error">
            {error}
          </p>
        )}


        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>


      <p style={{ marginTop: "1rem" }}>
        <Link to="/login">
          Back to Login
        </Link>
      </p>

    </div>
  );
}

export default ResetPassword;