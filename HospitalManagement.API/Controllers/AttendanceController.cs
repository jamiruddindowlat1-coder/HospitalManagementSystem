using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/Attendance
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.Attendances
                .Include(a => a.Employee)
                .Select(a => new
                {
                    a.AttendanceId,
                    a.EmployeeId,
                    EmployeeName = a.Employee != null
                        ? a.Employee.FullName
                        : "",
                    a.Date,
                    a.Status,
                    a.Remarks,
                    a.CreatedAt
                })
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return Ok(data);
        }


        // GET: api/Attendance/employee/2
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetByEmployee(int employeeId)
        {
            var data = await _context.Attendances
                .Include(a => a.Employee)
                .Where(a => a.EmployeeId == employeeId)
                .Select(a => new
                {
                    a.AttendanceId,
                    a.EmployeeId,
                    EmployeeName = a.Employee != null
                        ? a.Employee.FullName
                        : "",
                    a.Date,
                    a.Status,
                    a.Remarks,
                    a.CreatedAt
                })
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return Ok(data);
        }



        // POST: api/Attendance
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Attendance attendance)
        {
            var employeeExists = await _context.Employees
                .AnyAsync(e => e.EmployeeId == attendance.EmployeeId);


            if (!employeeExists)
            {
                return BadRequest(new
                {
                    message = "Employee not found."
                });
            }


            var alreadyExists = await _context.Attendances
                .AnyAsync(a =>
                    a.EmployeeId == attendance.EmployeeId &&
                    a.Date.Date == attendance.Date.Date
                );


            if (alreadyExists)
            {
                return BadRequest(new
                {
                    message = "Attendance already exists for this date."
                });
            }


            attendance.CreatedAt = DateTime.UtcNow;

            _context.Attendances.Add(attendance);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Attendance created successfully",
                data = attendance
            });
        }




        // PUT: api/Attendance/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] Attendance attendance)
        {
            var existing = await _context.Attendances
                .FirstOrDefaultAsync(a => a.AttendanceId == id);


            if (existing == null)
            {
                return NotFound(new
                {
                    message = "Attendance not found."
                });
            }


            var duplicate = await _context.Attendances
                .AnyAsync(a =>
                    a.EmployeeId == existing.EmployeeId &&
                    a.Date.Date == attendance.Date.Date &&
                    a.AttendanceId != id
                );


            if (duplicate)
            {
                return BadRequest(new
                {
                    message = "Attendance already exists for this date."
                });
            }


            existing.Status = attendance.Status;
            existing.Remarks = attendance.Remarks;
            existing.Date = attendance.Date;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Attendance updated successfully",
                data = existing
            });
        }




        // DELETE: api/Attendance/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.AttendanceId == id);


            if (attendance == null)
            {
                return NotFound(new
                {
                    message = "Attendance not found."
                });
            }


            _context.Attendances.Remove(attendance);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Attendance deleted successfully"
            });
        }
    }
}