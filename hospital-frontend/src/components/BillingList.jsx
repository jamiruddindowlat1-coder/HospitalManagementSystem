import { useEffect, useState } from 'react';
import api from '../services/api';
import "./SharedList.css";
import InvoiceModal from './InvoiceModal';

function BillingList() {

  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [selectedInvoiceBill, setSelectedInvoiceBill] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);


  const emptyForm = {
    patientId: '',
    appointmentId: '',
    admissionId: '',
    consultationFee: '0',
    roomCharge: '0',
    medicineCharge: '0',
    otherCharges: '0',
    paymentStatus: 'Unpaid'
  };


  const [form, setForm] = useState(emptyForm);



  useEffect(() => {
    fetchAll();
  }, []);




  const fetchAll = async () => {

    try {

      setLoading(true);


      const [
        billRes,
        patRes,
        apRes,
        adRes
      ] = await Promise.all([

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


    } catch(err) {

      console.error(err);

      setError('বিল তথ্য লোড করতে ব্যর্থ হয়েছে।');


    } finally {

      setLoading(false);

    }

  };





  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };





  const resetForm = () => {

    setForm(emptyForm);

    setEditingId(null);

  };






  const handleEdit = (bill) => {


    setEditingId(bill.billId);



    setForm({

      patientId: bill.patientId,

      appointmentId: bill.appointmentId || '',

      admissionId: bill.admissionId || '',

      consultationFee: bill.consultationFee,

      roomCharge: bill.roomCharge,

      medicineCharge: bill.medicineCharge,

      otherCharges: bill.otherCharges,

      paymentStatus: bill.paymentStatus

    });



    setShowForm(true);


  };






  const handleDelete = async(id) => {


    if(!window.confirm(
      "এই বিল ডিলিট করবেন?"
    ))
      return;



    try {


      await api.delete(
        `/billing/${id}`
      );


      fetchAll();


    } catch(err) {


      console.error(err);

      alert(
        "Bill delete করা যায়নি"
      );


    }

  };







  const handleSubmit = async(e) => {

    e.preventDefault();

    setSubmitting(true);



    const data = {

      billId: editingId || 0,

      patientId: parseInt(form.patientId),

      appointmentId:
        form.appointmentId
        ? parseInt(form.appointmentId)
        : null,

      admissionId:
        form.admissionId
        ? parseInt(form.admissionId)
        : null,


      consultationFee:
        parseFloat(form.consultationFee) || 0,


      roomCharge:
        parseFloat(form.roomCharge) || 0,


      medicineCharge:
        parseFloat(form.medicineCharge) || 0,


      otherCharges:
        parseFloat(form.otherCharges) || 0,


      paymentStatus:
        form.paymentStatus

    };



    try {


      if(editingId){


        await api.put(
          `/billing/${editingId}`,
          data
        );


      }
      else{


        await api.post(
          '/billing',
          data
        );


      }



      setShowForm(false);


      resetForm();


      fetchAll();



    } catch(err) {


      console.error(err);

      alert(
        "Bill save করা যায়নি"
      );


    }
    finally {


      setSubmitting(false);


    }


  };





  const handlePrint = () => window.print();



  if(loading)
    return (
      <div className="data-card">
        লোড হচ্ছে...
      </div>
    );


  if(error)
    return (
      <div className="data-card error">
        {error}
      </div>
    );



  const inputStyle = {

    width:'100%',

    padding:'0.4rem 0.6rem',

    borderRadius:'4px',

    border:'1px solid #cbd5e1',

    marginTop:'0.2rem'

  };
  return (
  <div className="page-container">
    <div className="header-box">
      <h2>বিলিং রিপোর্ট</h2>
    </div>

    <div className="count-box">
      Total Bills: {bills.length}
    </div>

    <div style={{textAlign: "center"}}>
      <button
        className="btn-add"
        onClick={() => {
          setShowForm(!showForm);
          if (showForm) resetForm();
        }}
      >
        {showForm ? '✕ বাতিল' : '➕ নতুন বিল'}
      </button>
      &nbsp;
      <button
        className="btn-add"
        onClick={handlePrint}
        style={{background: '#64748b', boxShadow: 'none'}}
      >
        Print
      </button>
    </div>

    {
      showForm && (

      <form
        onSubmit={handleSubmit}
        className="table-container"
        style={{
          padding: '25px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}
      >


        <div>
          <label>রোগী *</label>

          <select

            name="patientId"

            value={form.patientId}

            onChange={handleChange}

            required

            style={inputStyle}

          >

            <option value="">
              -- রোগী নির্বাচন করুন --
            </option>


            {
              patients.map(p=>(

                <option

                  key={p.patientId}

                  value={p.patientId}

                >
                  {p.fullName}
                </option>

              ))
            }


          </select>

        </div>





        <div>

          <label>
            পেমেন্ট স্ট্যাটাস
          </label>


          <select

            name="paymentStatus"

            value={form.paymentStatus}

            onChange={handleChange}

            style={inputStyle}

          >

            <option value="Unpaid">
              Unpaid
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Partial">
              Partial
            </option>

          </select>


        </div>






        <div>

          <label>
            অ্যাপয়েন্টমেন্ট
          </label>


          <select

            name="appointmentId"

            value={form.appointmentId}

            onChange={handleChange}

            style={inputStyle}

          >

            <option value="">
              -- নির্বাচন করুন --
            </option>


            {
              appointments.map(a=>(

                <option

                  key={a.appointmentId}

                  value={a.appointmentId}

                >

                  #{a.appointmentId}

                </option>

              ))
            }


          </select>


        </div>






        <div>

          <label>
            ভর্তি
          </label>


          <select

            name="admissionId"

            value={form.admissionId}

            onChange={handleChange}

            style={inputStyle}

          >

            <option value="">
              -- নির্বাচন করুন --
            </option>


            {
              admissions.map(a=>(

                <option

                  key={a.admissionId}

                  value={a.admissionId}

                >

                  #{a.admissionId}

                </option>

              ))
            }


          </select>


        </div>





        <div>

          <label>
            পরামর্শ ফি
          </label>

          <input

            type="number"

            name="consultationFee"

            value={form.consultationFee}

            onChange={handleChange}

            style={inputStyle}

          />

        </div>





        <div>

          <label>
            রুম চার্জ
          </label>

          <input

            type="number"

            name="roomCharge"

            value={form.roomCharge}

            onChange={handleChange}

            style={inputStyle}

          />

        </div>





        <div>

          <label>
            ওষুধ চার্জ
          </label>

          <input

            type="number"

            name="medicineCharge"

            value={form.medicineCharge}

            onChange={handleChange}

            style={inputStyle}

          />

        </div>





        <div>

          <label>
            অন্যান্য চার্জ
          </label>

          <input

            type="number"

            name="otherCharges"

            value={form.otherCharges}

            onChange={handleChange}

            style={inputStyle}

          />

        </div>





        <div
          style={{
            gridColumn:'1/-1',
            textAlign:'right'
          }}>
          <button
            type="submit"
            className="btn-add"
            disabled={submitting}
          >

            {
              submitting
              ?
              'সংরক্ষণ হচ্ছে...'
              :
              editingId
              ?
              'আপডেট করুন'
              :
              'সংরক্ষণ করুন'
            }

          </button>


        </div>


      </form>

      )

    }







    <div className="table-container">
    <table className="data-table">

      <thead>

        <tr>

          <th>ID</th>

          <th>রোগী</th>

          <th>মোট</th>

          <th>পেমেন্ট</th>

          <th>তারিখ</th>

          <th>Action</th>

        </tr>

      </thead>



      <tbody>


      {
        bills.map((bill)=>(


          <tr key={bill.billId}>


            <td>
              #{bill.billId}
            </td>


            <td>
              {bill.patient?.fullName || 'N/A'}
            </td>


            <td>
              {bill.totalAmount?.toFixed(2)} BDT
            </td>


            <td>
              {bill.paymentStatus}
            </td>


            <td>
              {new Date(
                bill.billDate
              ).toLocaleDateString()}
            </td>



            <td>
              <button
                className="btn-edit"
                style={{ background: "#0f766e" }}
                onClick={()=>setSelectedInvoiceBill(bill)}
              >
                🧾 Invoice
              </button>
              &nbsp;
              <button
                className="btn-edit"
                onClick={()=>handleEdit(bill)}
              >
                Edit
              </button>

              <button
                className="btn-delete"
                onClick={()=>handleDelete(bill.billId)}
              >
                Delete
              </button>
            </td>

          </tr>

        ))
      }

      </tbody>

    </table>
    </div>

    {selectedInvoiceBill && (
      <InvoiceModal 
        bill={selectedInvoiceBill} 
        onClose={() => setSelectedInvoiceBill(null)} 
      />
    )}

  </div>
);


}


export default BillingList;