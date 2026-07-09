import { useEffect, useState } from 'react';
import api from '../services/api';

function AdmissionList() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    patientId: '',
    roomId: '',
    doctorId: '',
    admissionDate: '',
    dischargeDate: '',
    status: 'Active',
  });

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admissions');
      setAdmissions(res.data);
    } catch (err) {
      setError('Admission লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const resetForm = () => {
    setForm({
      patientId: '',
      roomId: '',
      doctorId: '',
      admissionDate: '',
      dischargeDate: '',
      status: 'Active',
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientId: parseInt(form.patientId),
        roomId: parseInt(form.roomId),
        doctorId: parseInt(form.doctorId),
        admissionDate: form.admissionDate || new Date().toISOString(),
        dischargeDate: form.dischargeDate || null,
        status: form.status,
      };

      if (editingId) {
        await api.put(`/admissions/${editingId}`, { ...payload, admissionId: editingId });
        alert('Admission আপডেট হয়েছে!');
      } else {
        await api.post('/admissions', payload);
        alert('Admission যোগ হয়েছে!');
      }

      resetForm();
      fetchAdmissions();
    } catch (err) {
      alert('সমস্যা হয়েছে: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (admission) => {
    setEditingId(admission.admissionId);
    setForm({
      patientId: admission.patientId,
      roomId: admission.roomId,
      doctorId: admission.doctorId,
      admissionDate: admission.admissionDate
        ? admission.admissionDate.substring(0, 16)
        : '',
      dischargeDate: admission.dischargeDate
        ? admission.dischargeDate.substring(0, 16)
        : '',
      status: admission.status || 'Active',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('এই Admission মুছে ফেলবেন?')) return;
    try {
      await api.delete(`/admissions/${id}`);
      alert('Admission মুছে ফেলা হয়েছে।');
      fetchAdmissions();
    } catch (err) {
      alert('মুছতে সমস্যা: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{editingId ? '✏️ Admission সম্পাদনা' : '➕ নতুন Admission'}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gap: '10px', maxWidth: '500px' }}>
        <input
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          placeholder="Patient ID"
          type="number"
          required
          style={inputStyle}
        />
        <input
          name="roomId"
          value={form.roomId}
          onChange={handleChange}
          placeholder="Room ID"
          type="number"
          required
          style={inputStyle}
        />
        <input
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          placeholder="Doctor ID"
          type="number"
          required
          style={inputStyle}
        />
        <label style={{ fontSize: '13px', color: '#555' }}>
          Admission তারিখ
          <input
            name="admissionDate"
            value={form.admissionDate}
            onChange={handleChange}
            type="datetime-local"
            style={{ ...inputStyle, marginTop: '4px' }}
          />
        </label>
        <label style={{ fontSize: '13px', color: '#555' }}>
          Discharge তারিখ (ঐচ্ছিক)
          <input
            name="dischargeDate"
            value={form.dischargeDate}
            onChange={handleChange}
            type="datetime-local"
            style={{ ...inputStyle, marginTop: '4px' }}
          />
        </label>
        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="Active">Active</option>
          <option value="Discharged">Discharged</option>
          <option value="Pending">Pending</option>
        </select>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={btnPrimary}>
            {editingId ? '✅ আপডেট করুন' : '➕ যোগ করুন'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={btnSecondary}>
              ❌ বাতিল
            </button>
          )}
        </div>
      </form>

      <h2>📋 Admission তালিকা</h2>

      {loading && <p>লোড হচ্ছে...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && admissions.length === 0 && (
        <p style={{ color: '#888' }}>কোনো Admission রেকর্ড নেই।</p>
      )}

      {!loading && admissions.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={thStyle}>#ID</th>
                <th style={thStyle}>রোগী</th>
                <th style={thStyle}>রুম</th>
                <th style={thStyle}>ডাক্তার</th>
                <th style={thStyle}>Admission তারিখ</th>
                <th style={thStyle}>Discharge তারিখ</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((a) => (
                <tr key={a.admissionId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{a.admissionId}</td>
                  <td style={tdStyle}>
                    {a.patient?.fullName || `Patient #${a.patientId}`}
                    {a.patient?.contactNumber && (
                      <div style={{ fontSize: '12px', color: '#888' }}>{a.patient.contactNumber}</div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {a.room?.roomNumber || `Room #${a.roomId}`}
                    {a.room?.roomType && (
                      <div style={{ fontSize: '12px', color: '#888' }}>{a.room.roomType}</div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {a.doctor?.fullName || a.doctor?.user?.fullName || `Doctor #${a.doctorId}`}
                  </td>
                  <td style={tdStyle}>{formatDate(a.admissionDate)}</td>
                  <td style={tdStyle}>{formatDate(a.dischargeDate)}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: a.status === 'Active' ? '#d4edda' : a.status === 'Discharged' ? '#d1ecf1' : '#fff3cd',
                      color: a.status === 'Active' ? '#155724' : a.status === 'Discharged' ? '#0c5460' : '#856404',
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(a)} style={btnEdit}>✏️ Edit</button>
                    <button onClick={() => handleDelete(a.admissionId)} style={btnDelete}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles
const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
};

const btnPrimary = {
  padding: '8px 20px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

const btnSecondary = {
  padding: '8px 20px',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

const btnEdit = {
  padding: '4px 10px',
  background: '#ffc107',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginRight: '6px',
  fontSize: '12px',
};

const btnDelete = {
  padding: '4px 10px',
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
};

const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: '600',
};

const tdStyle = {
  padding: '10px 12px',
  verticalAlign: 'top',
};

export default AdmissionList;
