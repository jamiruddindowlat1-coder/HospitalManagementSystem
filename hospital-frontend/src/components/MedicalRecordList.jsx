import { useEffect, useState } from 'react';
import api from '../services/api';
import "./SharedList.css";

function MedicalRecordList() {
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    appointmentId: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [recordsRes, appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get('/medicalrecords'),
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/doctors'),
      ]);
      setRecords(recordsRes.data);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error(err);
      setError('মেডিকেল রেকর্ড লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const patientName = (id) => patients.find((p) => p.patientId === id)?.fullName || '—';
  const doctorName = (id) => doctors.find((d) => d.doctorId === id)?.fullName || '—';

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowForm(true);
  };

  const startEdit = (r) => {
    setEditingId(r.medicalRecordId);
    setForm({
      appointmentId: r.appointmentId ?? '',
      diagnosis: r.diagnosis || '',
      prescription: r.prescription || '',
      notes: r.notes || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.appointmentId || !form.diagnosis) {
      setFormError('অ্যাপয়েন্টমেন্ট এবং ডায়াগনসিস আবশ্যক।');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // ব্যাকএন্ড পুরো entity আশা করে (Entry state Modified), তাই
        // মূল রেকর্ড থেকে বাকি ফিল্ড (createdAt ইত্যাদি) সংরক্ষণ করে পাঠানো হচ্ছে
        const original = records.find((r) => r.medicalRecordId === editingId) || {};
        await api.put(`/medicalrecords/${editingId}`, {
          ...original,
          medicalRecordId: editingId,
          appointmentId: Number(form.appointmentId),
          diagnosis: form.diagnosis,
          prescription: form.prescription,
          notes: form.notes,
        });
      } else {
        await api.post('/medicalrecords', {
          appointmentId: Number(form.appointmentId),
          diagnosis: form.diagnosis,
          prescription: form.prescription,
          notes: form.notes,
        });
      }
      cancelForm();
      await loadAll();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setFormError('অনুমতি নেই — মেডিকেল রেকর্ড আপডেট শুধুমাত্র Doctor role করতে পারবে।');
      } else {
        const apiMessage = err.response?.data?.title || err.response?.data?.message;
        setFormError(apiMessage || 'রেকর্ড সংরক্ষণ করতে ব্যর্থ হয়েছে।');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই রেকর্ডটি ডিলিট করতে চান?')) return;
    try {
      await api.delete(`/medicalrecords/${id}`);
      await loadAll();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('অনুমতি নেই — মেডিকেল রেকর্ড ডিলিট শুধুমাত্র Admin role করতে পারবে।');
      } else {
        alert('রেকর্ড ডিলিট করতে ব্যর্থ হয়েছে।');
      }
    }
  };

  if (loading) {
    return <div className="data-card">লোড হচ্ছে...</div>;
  }

  return (
    <div className="page-container">
      <div className="header-box">
        <h2>মেডিকেল রেকর্ড</h2>
      </div>

      <div className="count-box">
        Total Records: {records.length}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn-add" onClick={() => (showForm ? cancelForm() : openAddForm())}>
          {showForm ? '✕ বাতিল করুন' : '➕ নতুন রেকর্ড'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="table-container" style={{ padding: '25px', display: 'grid', gap: '15px', maxWidth: '600px', margin: '0 auto', marginBottom: '20px' }}>
          <h3>{editingId ? 'মেডিকেল রেকর্ড এডিট করুন' : 'নতুন মেডিকেল রেকর্ড'}</h3>
          {formError && <div className="error" style={{color: 'red'}}>{formError}</div>}

          <div style={{ marginBottom: '10px' }}>
            <label>অ্যাপয়েন্টমেন্ট: </label>
            <select name="appointmentId" value={form.appointmentId} onChange={handleChange}>
              <option value="">-- নির্বাচন করুন --</option>
              {appointments.map((a) => (
                <option key={a.appointmentId} value={a.appointmentId}>
                  #{a.appointmentId} — {patientName(a.patientId)} / {doctorName(a.doctorId)} ({new Date(a.appointmentDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>ডায়াগনসিস: </label>
            <br />
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              rows="2"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>প্রেসক্রিপশন: </label>
            <br />
            <textarea
              name="prescription"
              value={form.prescription}
              onChange={handleChange}
              rows="3"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>নোটস: </label>
            <br />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{textAlign: 'right'}}>
          <button className="btn-add" type="submit" disabled={submitting}>
            {submitting ? 'জমা হচ্ছে...' : editingId ? 'আপডেট করুন' : 'রেকর্ড সংরক্ষণ করুন'}
          </button>
          </div>
        </form>
      )}
      <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>রোগী</th>
            <th>ডাক্তার</th>
            <th>ডায়াগনসিস</th>
            <th>প্রেসক্রিপশন</th>
            <th>নোটস</th>
            <th>তারিখ</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
          <tr key={r.medicalRecordId}>
              <td>#{r.medicalRecordId}</td>
              <td>{r.patientName || '—'}</td>
              <td>{r.doctorName || '—'}</td>
              <td>{r.diagnosis || '—'}</td>
              <td>{r.prescription || '—'}</td>
              <td>{r.notes || '—'}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn-edit" onClick={() => startEdit(r)} title="Edit">✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(r.medicalRecordId)} title="Delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default MedicalRecordList;
