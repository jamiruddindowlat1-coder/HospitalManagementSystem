import { useEffect, useState } from 'react';
import api from '../services/api';

function Admission() {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    patientId: '',
    roomId: '',
    doctorId: '',
    admissionDate: '',
    dischargeDate: '',
    status: 'Active',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes, dRes] = await Promise.all([
          api.get('/patients'),
          api.get('/rooms'),
          api.get('/doctors'),
        ]);
        setPatients(pRes.data);
        setRooms(rRes.data.filter((r) => r.isAvailable !== false));
        setDoctors(dRes.data);
      } catch (err) {
        setMessage('ডেটা লোড করতে সমস্যা হয়েছে।');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        patientId: parseInt(form.patientId),
        roomId: parseInt(form.roomId),
        doctorId: parseInt(form.doctorId),
        admissionDate: form.admissionDate
          ? new Date(form.admissionDate).toISOString()
          : new Date().toISOString(),
        dischargeDate: form.dischargeDate
          ? new Date(form.dischargeDate).toISOString()
          : null,
        status: form.status,
      };

      await api.post('/admissions', payload);
      setMessage('✅ Admission সফলভাবে যোগ হয়েছে!');
      setForm({
        patientId: '',
        roomId: '',
        doctorId: '',
        admissionDate: '',
        dischargeDate: '',
        status: 'Active',
      });
    } catch (err) {
      setMessage('❌ সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>🏥 নতুন Admission যোগ করুন</h2>

      {message && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '16px',
          borderRadius: '6px',
          background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
          color: message.startsWith('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`,
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Patient */}
        <div style={fieldGroup}>
          <label style={labelStyle}>রোগী (Patient) *</label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">-- রোগী বেছে নিন --</option>
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>
                {p.fullName} {p.contactNumber ? `(${p.contactNumber})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        <div style={fieldGroup}>
          <label style={labelStyle}>রুম (Room) *</label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">-- রুম বেছে নিন --</option>
            {rooms.map((r) => (
              <option key={r.roomId} value={r.roomId}>
                Room {r.roomNumber} — {r.roomType} (৳{r.pricePerDay}/দিন)
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div style={fieldGroup}>
          <label style={labelStyle}>ডাক্তার (Doctor) *</label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">-- ডাক্তার বেছে নিন --</option>
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                {d.fullName || d.user?.fullName}{d.specialization ? ` — ${d.specialization}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Date */}
        <div style={fieldGroup}>
          <label style={labelStyle}>Admission তারিখ *</label>
          <input
            name="admissionDate"
            value={form.admissionDate}
            onChange={handleChange}
            type="datetime-local"
            required
            style={inputStyle}
          />
        </div>

        {/* Discharge Date */}
        <div style={fieldGroup}>
          <label style={labelStyle}>Discharge তারিখ (ঐচ্ছিক)</label>
          <input
            name="dischargeDate"
            value={form.dischargeDate}
            onChange={handleChange}
            type="datetime-local"
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div style={fieldGroup}>
          <label style={labelStyle}>Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Discharged">Discharged</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" disabled={loading} style={btnPrimary}>
            {loading ? '⏳ যোগ হচ্ছে...' : '➕ Admission যোগ করুন'}
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                patientId: '',
                roomId: '',
                doctorId: '',
                admissionDate: '',
                dischargeDate: '',
                status: 'Active',
              })
            }
            style={btnSecondary}
          >
            🔄 রিসেট
          </button>
        </div>
      </form>
    </div>
  );
}

// Styles
const containerStyle = {
  padding: '24px',
  maxWidth: '800px',
  margin: '0 auto',
};

const formStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  background: '#fff',
  padding: '24px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
};

const inputStyle = {
  padding: '9px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fafafa',
};

const btnPrimary = {
  padding: '10px 24px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
};

const btnSecondary = {
  padding: '10px 24px',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default Admission;
