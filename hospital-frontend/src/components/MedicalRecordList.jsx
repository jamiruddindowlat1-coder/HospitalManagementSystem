import { useEffect, useState } from 'react';
import api from '../services/api';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.appointmentId || !form.diagnosis) {
      setFormError('অ্যাপয়েন্টমেন্ট এবং ডায়াগনসিস আবশ্যক।');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/medicalrecords', {
        appointmentId: Number(form.appointmentId),
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        notes: form.notes,
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadAll();
    } catch (err) {
      console.error(err);
      const apiMessage = err.response?.data?.title || err.response?.data?.message;
      setFormError(apiMessage || 'রেকর্ড যোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="data-card">লোড হচ্ছে...</div>;
  }

  return (
    <div className="data-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>মেডিকেল রেকর্ড</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'বাতিল করুন' : '+ নতুন রেকর্ড'}
        </button>
      </div>

      {error && <div className="data-card error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ margin: '16px 0', padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>নতুন মেডিকেল রেকর্ড</h3>
          {formError && <div className="error">{formError}</div>}

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

          <button type="submit" disabled={submitting}>
            {submitting ? 'জমা হচ্ছে...' : 'রেকর্ড সংরক্ষণ করুন'}
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>রোগী</th>
            <th>ডাক্তার</th>
            <th>ডায়াগনসিস</th>
            <th>প্রেসক্রিপশন</th>
            <th>নোটস</th>
            <th>তারিখ</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.recordId}>
              <td>#{r.recordId}</td>
              <td>{patientName(r.appointment?.patientId)}</td>
              <td>{doctorName(r.appointment?.doctorId)}</td>
              <td>{r.diagnosis || '—'}</td>
              <td>{r.prescription || '—'}</td>
              <td>{r.notes || '—'}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicalRecordList;
