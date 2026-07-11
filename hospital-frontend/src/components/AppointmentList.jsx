import { useState, useEffect } from 'react';
import api from '../services/api';

function AppointmentList() {

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);


  const emptyForm = {
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'Scheduled'
  };


  const [form, setForm] = useState(emptyForm);



  useEffect(() => {
    fetchAll();
  }, []);




  const fetchAll = async () => {

    try {

      setLoading(true);


      const [
        apRes,
        ptRes,
        drRes
      ] = await Promise.all([

        api.get('/appointments'),

        api.get('/patients'),

        api.get('/doctors')

      ]);


      setAppointments(apRes.data);

      setPatients(ptRes.data);

      setDoctors(drRes.data);


      setError('');


    } catch(err) {

      console.error(err);

      setError('অ্যাপয়েন্টমেন্ট লোড করতে ব্যর্থ হয়েছে।');


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







  const handleEdit = (appointment) => {


    setEditingId(appointment.appointmentId);



    setForm({

      patientId: appointment.patientId,

      doctorId: appointment.doctorId,

      appointmentDate:
        appointment.appointmentDate.split('T')[0],

      appointmentTime:
        appointment.appointmentTime,

      reason:
        appointment.reason,

      status:
        appointment.status

    });



    setShowForm(true);


  };






  const handleDelete = async(id) => {


    if(!window.confirm(
      "এই অ্যাপয়েন্টমেন্ট ডিলিট করবেন?"
    ))
    return;



    try {


      await api.delete(
        `/appointments/${id}`
      );


      fetchAll();



    } catch(err) {


      console.error(err);


      alert(
        "Delete করা যায়নি"
      );


    }


  };







  const handleSubmit = async(e)=>{


    e.preventDefault();


    setSubmitting(true);



    const data = {


      appointmentId:
        editingId || 0,


      patientId:
        parseInt(form.patientId),


      doctorId:
        parseInt(form.doctorId),


      appointmentDate:
        form.appointmentDate,


      appointmentTime:
        form.appointmentTime,


      reason:
        form.reason,


      status:
        form.status


    };



    try {


      if(editingId){


        await api.put(
          `/appointments/${editingId}`,
          data
        );


      }
      else{


        await api.post(
          '/appointments',
          data
        );


      }



      setShowForm(false);


      resetForm();


      fetchAll();



    }
    catch(err){


      console.error(err);


      alert(
        "সংরক্ষণ করা যায়নি"
      );


    }
    finally{


      setSubmitting(false);


    }


  };





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

    <div className="data-card">


      <div
        style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:'1rem'
        }}
      >

        <h2>
          অ্যাপয়েন্টমেন্ট
        </h2>


        <button

          onClick={()=>{

            setShowForm(!showForm);

            if(showForm)
              resetForm();

          }}

          style={{
            padding:'0.5rem 1rem',
            background:'#2563eb',
            color:'#fff',
            border:'none',
            borderRadius:'6px',
            cursor:'pointer'
          }}

        >

          {
            showForm
            ?
            '✕ বাতিল'
            :
            '+ নতুন অ্যাপয়েন্টমেন্ট'
          }

        </button>


      </div>





      {
        showForm && (


          <form

            onSubmit={handleSubmit}

            style={{

              background:'#f8fafc',

              padding:'1rem',

              borderRadius:'8px',

              marginBottom:'1.5rem',

              display:'grid',

              gridTemplateColumns:'1fr 1fr',

              gap:'0.75rem'

            }}

          >



            <div>

              <label>
                রোগী *
              </label>


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
                ডাক্তার *
              </label>


              <select

                name="doctorId"

                value={form.doctorId}

                onChange={handleChange}

                required

                style={inputStyle}

              >

                <option value="">
                  -- ডাক্তার নির্বাচন করুন --
                </option>


                {
                  doctors.map(d=>(

                    <option

                      key={d.doctorId}

                      value={d.doctorId}

                    >

                      {d.fullName} ({d.specialization})

                    </option>

                  ))
                }


              </select>


            </div>






            <div>

              <label>
                তারিখ *
              </label>


              <input

                type="date"

                name="appointmentDate"

                value={form.appointmentDate}

                onChange={handleChange}

                required

                style={inputStyle}

              />


            </div>







            <div>

              <label>
                সময় *
              </label>


              <input

                type="time"

                name="appointmentTime"

                value={form.appointmentTime}

                onChange={handleChange}

                required

                style={inputStyle}

              />


            </div>






            <div style={{gridColumn:'1/-1'}}>

              <label>
                কারণ *
              </label>


              <input

                name="reason"

                value={form.reason}

                onChange={handleChange}

                required

                style={inputStyle}

              />


            </div>






            <div>

              <label>
                স্ট্যাটাস
              </label>


              <select

                name="status"

                value={form.status}

                onChange={handleChange}

                style={inputStyle}

              >

                <option value="Scheduled">
                  নির্ধারিত
                </option>


                <option value="Completed">
                  সম্পন্ন
                </option>


                <option value="Cancelled">
                  বাতিল
                </option>


              </select>


            </div>







            <div

              style={{

                gridColumn:'1/-1',

                textAlign:'right'

              }}

            >

              <button

                type="submit"

                disabled={submitting}

                style={{

                  padding:'0.5rem 1.5rem',

                  background:'#16a34a',

                  color:'#fff',

                  border:'none',

                  borderRadius:'6px',

                  cursor:'pointer'

                }}

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







      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>রোগী</th>

            <th>ডাক্তার</th>

            <th>তারিখ</th>

            <th>সময়</th>

            <th>স্ট্যাটাস</th>

            <th>Action</th>


          </tr>


        </thead>




        <tbody>


          {
            appointments.map((a)=>(


              <tr key={a.appointmentId}>


                <td>
                  #{a.appointmentId}
                </td>


                <td>
                  {a.patient?.fullName || 'N/A'}
                </td>


                <td>
                  {a.doctor?.fullName || 'N/A'}
                </td>


                <td>
                  {
                    new Date(
                      a.appointmentDate
                    )
                    .toLocaleDateString('bn-BD')
                  }
                </td>


                <td>
                  {a.appointmentTime}
                </td>


                <td>
                  {a.status}
                </td>



                <td>


                  <button

                    onClick={()=>handleEdit(a)}

                    style={{

                      background:'#2563eb',

                      color:'#fff',

                      border:'none',

                      padding:'5px 10px',

                      borderRadius:'4px',

                      marginRight:'5px',

                      cursor:'pointer'

                    }}

                  >

                    Edit

                  </button>





                  <button

                    onClick={()=>handleDelete(a.appointmentId)}

                    style={{

                      background:'#dc2626',

                      color:'#fff',

                      border:'none',

                      padding:'5px 10px',

                      borderRadius:'4px',

                      cursor:'pointer'

                    }}

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


  );

}


export default AppointmentList;