import { useEffect, useState } from "react";
import api from "../services/api";
import payrollService from "../services/payrollService";
import { useToast } from "./ToastContext.jsx";
import "./SharedList.css";

function PayrollList() {

  const toast = useToast();

  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const now = new Date();

  const [formData, setFormData] = useState({
    employeeId: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalAllowance: "",
    totalDeduction: ""
  });


  useEffect(() => {
    getEmployees();
    getPayrolls();
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


  const getPayrolls = async () => {
    try {
      setLoading(true);
      const res = await payrollService.getAll();
      setPayrolls(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Payroll load failed");
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

      await payrollService.create({
        employeeId: Number(formData.employeeId),
        month: Number(formData.month),
        year: Number(formData.year),
        houseRentAllowance: 0,
        medicalAllowance: 0,
        transportAllowance: 0,
        otherAllowance: Number(formData.totalAllowance) || 0,
        providentFund: 0,
        taxDeduction: 0,
        absenceDeduction: 0,
        otherDeduction: Number(formData.totalDeduction) || 0
      });

      toast.success("Payroll generated");

      setFormData({
        employeeId: "",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        totalAllowance: "",
        totalDeduction: ""
      });

      getPayrolls();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Save failed"
      );

    }

  };


  const handleMarkPaid = async (id) => {
    try {
      await payrollService.markAsPaid(id);
      toast.success("Marked as paid");
      getPayrolls();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Action failed"
      );
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;

    try {
      await payrollService.delete(id);
      toast.success("Payroll deleted");
      getPayrolls();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };


  return (

    <div className="list-container">

      <div className="list-header">
        <h2>Payroll</h2>
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


          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {
              monthNames.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))
            }
          </select>


          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            step="0.01"
            name="totalAllowance"
            placeholder="Total Allowance"
            value={formData.totalAllowance}
            onChange={handleChange}
          />


          <input
            type="number"
            step="0.01"
            name="totalDeduction"
            placeholder="Total Deduction"
            value={formData.totalDeduction}
            onChange={handleChange}
          />

        </div>


        <button
          className="btn-primary"
          type="submit"
        >
          Generate Payroll
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
              <th>Month/Year</th>
              <th>Basic</th>
              <th>Gross</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

          {
            payrolls.map(item => (

              <tr key={item.payrollId}>

                <td>
                  {item.employeeName}
                </td>

                <td>
                  {monthNames[item.month - 1]} {item.year}
                </td>

                <td>
                  {item.basicSalary}
                </td>

                <td>
                  {item.grossSalary}
                </td>

                <td>
                  {item.totalDeductions}
                </td>

                <td>
                  <strong>{item.netSalary}</strong>
                </td>

                <td>
                  <span className={item.status === "Paid" ? "badge-success" : "badge-pending"}>
                    {item.status}
                  </span>
                </td>

                <td>
                  {
                    item.status !== "Paid" &&
                    <>
                      <button
                        className="btn-small btn-primary"
                        onClick={() => handleMarkPaid(item.payrollId)}
                      >
                        Mark Paid
                      </button>

                      <button
                        className="btn-small btn-danger"
                        onClick={() => handleDelete(item.payrollId)}
                      >
                        Delete
                      </button>
                    </>
                  }
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


export default PayrollList;
