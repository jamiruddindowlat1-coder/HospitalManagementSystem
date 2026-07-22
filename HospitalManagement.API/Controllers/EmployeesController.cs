using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
        {
            var employees = await _context.Employees
                .Include(e => e.Department)
                .Select(e => new EmployeeDto
                {
                    EmployeeId = e.EmployeeId,
                    FullName = e.FullName,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department != null ? e.Department.DepartmentName : null,
                    Designation = e.Designation,
                    Phone = e.Phone,
                    Email = e.Email,
                    Address = e.Address,
                    NID = e.NID,
                    EmergencyContactName = e.EmergencyContactName,
                    EmergencyContactPhone = e.EmergencyContactPhone,
                    JoiningDate = e.JoiningDate,
                    Salary = e.Salary,
                    Status = e.Status,
                    UserId = e.UserId
                })
                .ToListAsync();

            return Ok(employees);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
        {
            var e = await _context.Employees.Include(x => x.Department)
                .FirstOrDefaultAsync(x => x.EmployeeId == id);

            if (e == null) return NotFound();

            return Ok(new EmployeeDto
            {
                EmployeeId = e.EmployeeId,
                FullName = e.FullName,
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department?.DepartmentName,
                Designation = e.Designation,
                Phone = e.Phone,
                Email = e.Email,
                Address = e.Address,
                NID = e.NID,
                EmergencyContactName = e.EmergencyContactName,
                EmergencyContactPhone = e.EmergencyContactPhone,
                JoiningDate = e.JoiningDate,
                Salary = e.Salary,
                Status = e.Status,
                UserId = e.UserId
            });
        }

        // POST: api/employees
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee(EmployeeCreateDto dto)
        {
            var employee = new Employee
            {
                FullName = dto.FullName,
                DepartmentId = dto.DepartmentId,
                Designation = dto.Designation,
                Phone = dto.Phone,
                Email = dto.Email,
                Address = dto.Address,
                NID = dto.NID,
                EmergencyContactName = dto.EmergencyContactName,
                EmergencyContactPhone = dto.EmergencyContactPhone,
                JoiningDate = dto.JoiningDate,
                Salary = dto.Salary,
                UserId = dto.UserId,
                Status = "Active"
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        // PUT: api/employees/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(int id, EmployeeUpdateDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            employee.FullName = dto.FullName;
            employee.DepartmentId = dto.DepartmentId;
            employee.Designation = dto.Designation;
            employee.Phone = dto.Phone;
            employee.Email = dto.Email;
            employee.Address = dto.Address;
            employee.NID = dto.NID;
            employee.EmergencyContactName = dto.EmergencyContactName;
            employee.EmergencyContactPhone = dto.EmergencyContactPhone;
            employee.JoiningDate = dto.JoiningDate;
            employee.Salary = dto.Salary;
            employee.UserId = dto.UserId;
            employee.Status = dto.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/employees/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}