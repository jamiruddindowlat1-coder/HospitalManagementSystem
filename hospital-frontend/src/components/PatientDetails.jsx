import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data);
      } catch (err) {
        console.error(err);
        setError('রোগীর বিস্তারিত লোড করতে ব্যর্থ হয়েছে।');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPatient();
  }, [id]);

  if (loading) return <div className="data-card">লোড হচ্ছে...</div>;
  if (error) return <div className="data-card error">{error}</div>;

  return (
    <div className="data-card">
      <h2>রোগীর বিস্তারিত</h2>
      {patient ? (
        <div className="patient-details">
          <p><strong>নাম:</strong> {patient.fullName}</p>
          <p><strong>ইমেইল:</strong> {patient.email}</p>
          <p><strong>মোবাইল:</strong> {patient.contactNumber}</p>
          <p><strong>জন্ম তারিখ:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>রক্তের গ্রুপ:</strong> {patient.bloodGroup}</p>
          <p><strong>ঠিকানা:</strong> {patient.address}</p>
          <p><strong> এমার্জেন্সি:</strong> {patient.emergencyContactName} ({patient.emergencyContactNumber})</p>
          <p><strong>মেডিকেল ইতিহাস:</strong> {patient.medicalHistory}</p>
        </div>
      ) : (
        <p>রোগী পাওয়া যায়নি।</p>
      )}
    </div>
  );
}

export default PatientDetails;
