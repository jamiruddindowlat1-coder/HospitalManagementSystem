import { useState, useEffect } from 'react';
import api from '../services/api';

function DoctorList() {

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);


  const emptyForm = {
    fullName: '',
    specialization: '',
    departmentId: '',
    phoneNumber: '',
    email: '',
    qualification: '',
    experienceYears: '',
    consultationFee: '',
    isAvailable: true
  };


  const [form, setForm] = useState(emptyForm);



  useEffect(() => {

    fetchDoctors();
    fetchDepartments();

  }, []);



  const fetchDoctors = async () => {

    try {

      setLoading(true);

      const response = await api.get('/doctors');

      setDoctors(response.data);

      setError('');

    } catch(err){

      console.error(err);

      setError('ডাক্তারের তালিকা লোড করতে ব্যর্থ হয়েছে।');

    }
    finally{

      setLoading(false);

    }

  };




  const fetchDepartments = async()=>{

    try{

      const response = await api.get('/departments');

      setDepartments(response.data);

    }
    catch(err){

      console.error(err);

    }

  };





  const handleChange=(e)=>{

    const value =
      e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value;


    setForm({

      ...form,

      [e.target.name]:value

    });

  };





  const resetForm=()=>{

    setForm(emptyForm);

    setEditingId(null);

  };






  const handleEdit=(doctor)=>{


    setEditingId(doctor.doctorId);


    setForm({

      fullName: doctor.fullName,

      specialization: doctor.specialization,

      departmentId: doctor.departmentId,

      phoneNumber: doctor.phoneNumber,

      email: doctor.email,

      qualification: doctor.qualification,

      experienceYears: doctor.experienceYears,

      consultationFee: doctor.consultationFee,

      isAvailable: doctor.isAvailable

    });



    setShowForm(true);


  };






  const handleDelete=async(id)=>{


    const confirmDelete =
      window.confirm(
        "আপনি কি এই ডাক্তারকে ডিলিট করতে চান?"
      );


    if(!confirmDelete) return;



    try{


      await api.delete(`/doctors/${id}`);


      fetchDoctors();


    }
    catch(err){


      console.error(err);


      alert("ডাক্তার ডিলিট করা যায়নি");


    }


  };







  const handleSubmit=async(e)=>{


    e.preventDefault();


    setSubmitting(true);



    const data={


      doctorId: editingId || 0,

      fullName: form.fullName,

      specialization: form.specialization,

      departmentId: parseInt(form.departmentId),

      phoneNumber: form.phoneNumber,

      email: form.email,

      qualification: form.qualification,

      experienceYears: parseInt(form.experienceYears),

      consultationFee: parseFloat(form.consultationFee),

      isAvailable: form.isAvailable


    };



    try{


      if(editingId){


        await api.put(
          `/doctors/${editingId}`,
          data
        );


      }
      else{


        await api.post(
          '/doctors',
          data
        );


      }



      setShowForm(false);


      resetForm();


      fetchDoctors();



    }
    catch(err){


      console.error(err);


      alert(
        "ডাক্তার সংরক্ষণ করা যায়নি"
      );


    }
    finally{


      setSubmitting(false);


    }


  };




  if(loading)
    return <div className="data-card">
      লোড হচ্ছে...
    </div>;



  if(error)
    return <div className="data-card error">
      {error}
    </div>;



  const inputStyle={

    width:'100%',

    padding:'0.4rem 0.6rem',

    borderRadius:'4px',

    border:'1px solid #cbd5e1',

    marginTop:'5px'

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
          ডাক্তার তালিকা
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
            ? '✕ বাতিল'
            : '+ নতুন ডাক্তার'
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
                পূর্ণ নাম *
              </label>

              <input

                name="fullName"

                value={form.fullName}

                onChange={handleChange}

                required

                style={inputStyle}

              />

            </div>




            <div>

              <label>
                বিশেষত্ব *
              </label>


              <input

                name="specialization"

                value={form.specialization}

                onChange={handleChange}

                required

                style={inputStyle}

              />

            </div>





            <div>

              <label>
                বিভাগ *
              </label>


              <select

                name="departmentId"

                value={form.departmentId}

                onChange={handleChange}

                required

                style={inputStyle}

              >


                <option value="">
                  -- বিভাগ নির্বাচন করুন --
                </option>


                {
                  departments.map(d=>(

                    <option

                      key={d.departmentId}

                      value={d.departmentId}

                    >

                      {d.departmentName}

                    </option>

                  ))
                }


              </select>


            </div>






            <div>

              <label>
                যোগ্যতা *
              </label>


              <input

                name="qualification"

                value={form.qualification}

                onChange={handleChange}

                required

                style={inputStyle}

              />

            </div>






            <div>

              <label>
                মোবাইল *
              </label>


              <input

                name="phoneNumber"

                value={form.phoneNumber}

                onChange={handleChange}

                required

                style={inputStyle}

              />

            </div>






            <div>

              <label>
                ইমেইল *
              </label>


              <input

                type="email"

                name="email"

                value={form.email}

                onChange={handleChange}

                required

                style={inputStyle}

              />

            </div>






            <div>

              <label>
                অভিজ্ঞতা (বছর) *
              </label>


              <input

                type="number"

                name="experienceYears"

                value={form.experienceYears}

                onChange={handleChange}

                required

                style={inputStyle}

              />


            </div>







            <div>

              <label>
                পরামর্শ ফি (BDT) *
              </label>


              <input

                type="number"

                name="consultationFee"

                value={form.consultationFee}

                onChange={handleChange}

                required

                style={inputStyle}

              />


            </div>







            <div

              style={{

                display:'flex',

                alignItems:'center',

                gap:'8px',

                marginTop:'20px'

              }}

            >


              <input

                type="checkbox"

                name="isAvailable"

                checked={form.isAvailable}

                onChange={handleChange}

              />


              <label>
                এখন উপলব্ধ
              </label>


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

            <th>নাম</th>

            <th>বিশেষত্ব</th>

            <th>অভিজ্ঞতা</th>

            <th>ফি</th>

            <th>মোবাইল</th>

            <th>Action</th>

          </tr>


        </thead>





        <tbody>


          {

            doctors.map(d=>(


              <tr key={d.doctorId}>


                <td>
                  #{d.doctorId}
                </td>


                <td>
                  {d.fullName}
                </td>


                <td>
                  {d.specialization}
                </td>


                <td>
                  {d.experienceYears} বছর
                </td>


                <td>
                  {d.consultationFee} BDT
                </td>


                <td>
                  {d.phoneNumber}
                </td>



                <td>


                  <button

                    onClick={()=>handleEdit(d)}

                    style={{

                      background:'#2563eb',

                      color:'#fff',

                      border:'none',

                      padding:'5px 10px',

                      borderRadius:'4px',

                      cursor:'pointer',

                      marginRight:'5px'

                    }}

                  >

                    Edit

                  </button>





                  <button

                    onClick={()=>handleDelete(d.doctorId)}

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


export default DoctorList;