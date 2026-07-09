import { useEffect, useState } from 'react';
import api from '../services/api';

function BillingList() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: '', appointmentId: '', admissionId: '',
    consultationFee: '0', roomCharge: '0', medicineCharge: '0',
    otherCharges: '0', paymentStatus: 'Unpaid'
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [billRes, patRes, apRes, adRes] = await Promise.all([
        api.get('/billing'),
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/admissions')
      ]);
      setBills(billRes.data);
      setPatients(patRes.data);
      setAppointments(apRes.data);
      setAdmissions(adRes.data);
      setError('');
    } catch (err) {
      setError('বিল তথ্য লোড করতে ব্যর্থ হয়েছে।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/billing', {
        patientId: parseInt(form.patientId),
        appointmentId: form.appointmentId ? parseInt(form.appointmentId) : null,
        admissionId: form.admissionId ? parseInt(form.admissionId) : null,
        consultationFee: parseFloat(form.consultationFee) || 0,
        roomCharge: parseFloat(form.roomCharge) || 0,
        medicineCharge: parseFloat(form.medicineCharge) || 0,
        otherCharges: parseFloat(form.otherCharges) || 0,
        paymentStatus: form.paymentStatus
      });
      setShowForm(false);
      setForm({ patientId: '', appointmentId: '', admissionId: '', consultationFee: '0', roomCharge: '0', medicineCharge: '0', otherCharges: '0', paymentStatus: 'Unpaid' });
      fetchAll();
    } catch (err) {
      alert('বিল যোগ করতে ব্যর্থ হয়েছে।');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return <div className="data-card">লোড হচ্ছে...</div>;
  if (error) return <div className="data-card error">{error}</div>;

  const inputStyle = { width: '100%', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '0.2rem' };

  return (
    <div className="data-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>বিলিং রিপোর্ট</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {showForm ? '✕ বাতিল' : '+ নতুন বিল'}
          </button>
          <button onClick={handlePrint} style={{ padding: '0.5rem 1rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Print
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div><label>রোগী *</label>
            <select name="patientId" value={form.patientId} onChange={handleChange} required style={inputStyle}>
              <option value="">-- রোগী নির্বাচন করুন --</option>
              {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName}</option>)}
            </select>
          </div>
          <div><label>পেমেন্ট স্ট্যাটাস</label>
            <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} style={inputStyle}>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
          <div><label>অ্যাপয়েন্টমেন্ট (ঐচ্ছিক)</label>
            <select name="appointmentId" value={form.appointmentId} onChange={handleChange} style={inputStyle}>
              <option value="">-- নির্বাচন করুন --</option>
              {appointments.map(a => <option key={a.appointmentId} value={a.appointmentId}>#{a.appointmentId} - {a.patient?.fullName || 'N/A'}</option>)}
            </select>
          </div>
          <div><label>ভর্তি (ঐচ্ছিক)</label>
            <select name="admissionId" value={form.admissionId} onChange={handleChange} style={inputStyle}>
              <option value="">-- নির্বাচন করুন --</option>
              {admissions.map(a => <option key={a.admissionId} value={a.admissionId}>#{a.admissionId} - {a.patient?.fullName || 'N/A'}</option>)}
            </select>
          </div>
          <div><label>পরামর্শ ফি (BDT)</label><input name="consultationFee" type="number" value={form.consultationFee} onChange={handleChange} max="999999" style={inputStyle} /></div>
          <div><label>রুম চার্জ (BDT)</label><input name="roomCharge" type="number" value={form.roomCharge} onChange={handleChange} max="999999" style={inputStyle} /></div>
          <div><label>ওষুধ চার্জ (BDT)</label><input name="medicineCharge" type="number" value={form.medicineCharge} onChange={handleChange} max="999999" style={inputStyle} /></div>
          <div><label>অন্যান্য চার্জ (BDT)</label><input name="otherCharges" type="number" value={form.otherCharges} onChange={handleChange} max="999999" style={inputStyle} /></div>
          <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
            <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {submitting ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr><th>ID</th><th>রোগী</th><th>মোট</th><th>পেমেন্ট স্ট্যাটাস</th><th>তারিখ</th></tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.billId}>
              <td>#{bill.billId}</td>
              <td>{bill.patient?.fullName || 'N/A'}</td>
              <td>{bill.totalAmount.toFixed(2)} BDT</td>
              <td>{bill.paymentStatus}</td>
              <td>{new Date(bill.billDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillingList;
