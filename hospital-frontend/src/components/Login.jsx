import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { saveToken } from '../services/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      saveToken(response.data.token);
      onLogin();
      navigate('/');
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে। ইমেইল/পাসওয়ার্ড চেক করুন।');
      console.error(err);
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

        <div className="login-hint">
          <p>ডেমো লগইন: <strong>admin@hospital.local</strong> / <strong>Admin123!</strong></p>
          <p>অথবা <strong>sarah.khan@hospital.local</strong> / <strong>Doctor123!</strong></p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'প্রক্রিয়াজাত হচ্ছে...' : 'লগইন'}
        </button>
      </form>
    </div>
  );
}

export default Login;
