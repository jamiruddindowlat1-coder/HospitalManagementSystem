import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { saveToken, saveRefreshToken } from "../services/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/Auth/login", {
        email,
        password,
      });

      const data = response.data;

      // Save JWT Token
      if (data.token) {
        saveToken(data.token);
      }

      // Save Refresh Token (if available)
      if (data.refreshToken) {
        saveRefreshToken(data.refreshToken);
      }

      // Notify parent component
      if (onLogin) {
        onLogin(data);
      }

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        err.response?.data?.message ||
          "লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <h2>লগইন করুন</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>ইমেইল</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hospital.local"
            required
          />
        </div>

        <div className="form-group">
          <label>পাসওয়ার্ড</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <p style={{ textAlign: "right" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <div className="login-hint">
          <p>
            ডেমো লগইন:
            <strong> admin@hospital.local</strong> /
            <strong> Admin123!</strong>
          </p>

          <p>
            অথবা
            <strong> sarah.khan@hospital.local</strong> /
            <strong> Doctor123!</strong>
          </p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "প্রক্রিয়াজাত হচ্ছে..." : "লগইন"}
        </button>
      </form>
    </div>
  );
}

export default Login;