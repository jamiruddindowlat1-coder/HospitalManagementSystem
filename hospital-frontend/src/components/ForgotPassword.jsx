import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetToken("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@hospital.local"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {message && <p>{message}</p>}

        {resetToken && (
          <div className="login-hint">
            <p><strong>Dev/Test Mode:</strong> Reset token (would normally be emailed):</p>
            <p style={{ wordBreak: "break-all" }}><code>{resetToken}</code></p>
            <p>
              <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>Click here to reset your password</Link>
            </p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;

