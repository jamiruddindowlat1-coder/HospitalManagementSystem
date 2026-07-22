import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "./ToastContext.jsx";
import "./SharedList.css";

function AttendanceList() {

  const toast = useToast();

  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    status: "Present",
    remarks: ""
  });


  useEffect(() => {
    getEmployees();
    getAttendance();
  }, []);


  const getEmployees = async () => {
    try {
      const res = await api.get("/Employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Employee load failed");
    }
  };


  const getAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/Attendance");

      setAttendance(res.data);

    } catch (error) {
      console.log(error);
      toast.error("Attendance load failed");
    }
    finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post("/Attendance", {
        employeeId: Number(formData.employeeId),
        date: formData.date,
        status: formData.status,
        remarks: formData.remarks
      });


      toast.success("Attendance added");


      setFormData({
        employeeId:"",
        date:"",
        status:"Present",
        remarks:""
      });


      getAttendance();


    } catch(error){

      toast.error(
        error.response?.data?.message ||
        "Save failed"
      );

    }

  };


  return (

    <div className="list-container">

      <div className="list-header">
        <h2>Attendance (HR)</h2>
      </div>


      <form 
        className="entity-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">


          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Employee
            </option>


            {
              employees.map(emp => (
                <option
                  key={emp.employeeId}
                  value={emp.employeeId}
                >
                  {emp.fullName}
                </option>
              ))
            }

          </select>



          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />



          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="Late">
              Late
            </option>

            <option value="Leave">
              Leave
            </option>

          </select>



          <input
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
          />


        </div>


        <button 
          className="btn-primary"
          type="submit"
        >
          Save Attendance
        </button>


      </form>



      {
        loading ?

        <p>Loading...</p>

        :

        <table className="list-table">

          <thead>

            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>

          </thead>


          <tbody>

          {
            attendance.map(item => (

              <tr key={item.attendanceId}>

                <td>
                  {item.employeeName}
                </td>


                <td>
                  {item.date?.split("T")[0]}
                </td>


                <td>
                  {item.status}
                </td>


                <td>
                  {item.remarks}
                </td>


              </tr>

            ))
          }

          </tbody>


        </table>

      }


    </div>

  );

}


export default AttendanceList;
