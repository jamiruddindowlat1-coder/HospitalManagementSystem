import { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";
import { useToast } from "./ToastContext.jsx";

function LeaveList() {

  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "Casual",
    fromDate: "",
    toDate: "",
    reason: ""
  });


  const loadData = async () => {

    try {

      const [leaveResponse, employeeResponse] = await Promise.all([
        api.get("/Leaves"),
        api.get("/Employees")
      ]);

      setLeaves(leaveResponse.data);
      setEmployees(employeeResponse.data);

    }
    catch(error){

      console.error(error);
      toast.error("Leave load failed");

    }

  };


  useEffect(() => {

    loadData();

  }, []);



  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };



  const submitLeave = async(e)=>{

    e.preventDefault();

    try{

      await api.post("/Leaves",{

        employeeId:Number(form.employeeId),
        leaveType:form.leaveType,
        fromDate:form.fromDate,
        toDate:form.toDate,
        reason:form.reason

      });


      toast.success("Leave request created");


      setForm({

        employeeId:"",
        leaveType:"Casual",
        fromDate:"",
        toDate:"",
        reason:""

      });


      loadData();

    }
    catch(error){

      console.error(error);
      toast.error("Leave save failed");

    }

  };



  const approveLeave = async(id)=>{

    try{

      await api.put(`/Leaves/${id}/approve`);

      toast.success("Leave Approved");

      loadData();

    }
    catch(error){

      console.error(error);
      toast.error("Approve failed");

    }

  };



  const rejectLeave = async(id)=>{

    try{

      await api.put(`/Leaves/${id}/reject`);

      toast.success("Leave Rejected");

      loadData();

    }
    catch(error){

      console.error(error);
      toast.error("Reject failed");

    }

  };



  return (

    <div className="page-container">

      <div className="header-box">
        <h2>Leave Management</h2>
      </div>


      <form
        className="table-container"
        onSubmit={submitLeave}
        style={{
          padding:"20px",
          display:"grid",
          gap:"12px"
        }}
      >


        <select
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Employee
          </option>


          {
            employees.map(emp=>(

              <option
                key={emp.employeeId}
                value={emp.employeeId}
              >

                {emp.fullName}

              </option>

            ))
          }


        </select>



        <select
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
        >

          <option>Casual</option>
          <option>Sick</option>
          <option>Earned</option>

        </select>



        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          onChange={handleChange}
          required
        />


        <input
          type="date"
          name="toDate"
          value={form.toDate}
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />


        <button
          className="btn-add"
          type="submit"
        >
          Submit Leave
        </button>


      </form>




      <div className="table-container">

        <table className="data-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>


          {
            leaves.map(leave=>(

              <tr key={leave.leaveId}>


                <td>{leave.leaveId}</td>

                <td>{leave.employeeName}</td>

                <td>{leave.leaveType}</td>

                <td>
                  {leave.fromDate?.substring(0,10)}
                </td>

                <td>
                  {leave.toDate?.substring(0,10)}
                </td>

                <td>
                  {leave.status}
                </td>


                <td>


                {
                  leave.status==="Pending" &&

                  <>

                  <button
                    className="btn-edit"
                    onClick={()=>approveLeave(leave.leaveId)}
                  >
                    Approve
                  </button>


                  <button
                    className="btn-delete"
                    onClick={()=>rejectLeave(leave.leaveId)}
                  >
                    Reject
                  </button>


                  </>

                }


                </td>


              </tr>

            ))
          }


          </tbody>


        </table>


      </div>


    </div>

  );

}


export default LeaveList;