using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeavesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public LeavesController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        // GET: api/Leaves
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveDto>>> GetLeaves()
        {
            var leaves = await _context.Leaves
                .Include(l => l.Employee)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(leaves.Select(MapToDto));
        }

        // GET: api/Leaves/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveDto>> GetLeave(int id)
        {
            var leave = await _context.Leaves
                .Include(l => l.Employee)
                .FirstOrDefaultAsync(l => l.LeaveId == id);

            if (leave == null)
                return NotFound(new { message = "Leave record not found." });

            return Ok(MapToDto(leave));
        }

        // POST: api/Leaves
        [HttpPost]
        public async Task<ActionResult<LeaveDto>> CreateLeave(LeaveCreateDto dto)
        {
            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null)
                return BadRequest(new { message = "Employee not found." });

            if (dto.ToDate < dto.FromDate)
                return BadRequest(new { message = "To date cannot be before From date." });

            var leave = new Leave
            {
                EmployeeId = dto.EmployeeId,
                LeaveType = dto.LeaveType,
                FromDate = dto.FromDate.Date,
                ToDate = dto.ToDate.Date,
                Reason = dto.Reason,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Leaves.Add(leave);
            await _context.SaveChangesAsync();

            await _context.Entry(leave).Reference(l => l.Employee).LoadAsync();

            await _activityLog.LogAsync(
                "Created",
                "Leave",
                $"Leave request submitted for {leave.Employee?.FullName} ({leave.FromDate:yyyy-MM-dd} to {leave.ToDate:yyyy-MM-dd}).",
                User.GetUserId());

            return CreatedAtAction(nameof(GetLeave), new { id = leave.LeaveId }, MapToDto(leave));
        }

        // PUT: api/Leaves/5/approve
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveLeave(int id)
        {
            var leave = await _context.Leaves
                .Include(l => l.Employee)
                .FirstOrDefaultAsync(l => l.LeaveId == id);

            if (leave == null)
                return NotFound(new { message = "Leave record not found." });

            if (leave.Status != "Pending")
                return BadRequest(new { message = "Only pending leave requests can be approved." });

            leave.Status = "Approved";
            leave.DecisionDate = DateTime.UtcNow;

            // Auto-sync each day of the leave range into Attendance
            for (var date = leave.FromDate; date <= leave.ToDate; date = date.AddDays(1))
            {
                bool alreadyExists = await _context.Attendances.AnyAsync(a =>
                    a.EmployeeId == leave.EmployeeId &&
                    a.Date == date);

                if (!alreadyExists)
                {
                    _context.Attendances.Add(new Attendance
                    {
                        EmployeeId = leave.EmployeeId,
                        Date = date,
                        Status = "Leave",
                        Remarks = $"Auto-marked from Leave #{leave.LeaveId} ({leave.LeaveType})",
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Updated",
                "Leave",
                $"Leave #{leave.LeaveId} for {leave.Employee?.FullName} approved. Attendance synced.",
                User.GetUserId());

            return Ok(new { message = "Leave approved and attendance updated." });
        }

        // PUT: api/Leaves/5/reject
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectLeave(int id)
        {
            var leave = await _context.Leaves
                .Include(l => l.Employee)
                .FirstOrDefaultAsync(l => l.LeaveId == id);

            if (leave == null)
                return NotFound(new { message = "Leave record not found." });

            if (leave.Status != "Pending")
                return BadRequest(new { message = "Only pending leave requests can be rejected." });

            leave.Status = "Rejected";
            leave.DecisionDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Updated",
                "Leave",
                $"Leave #{leave.LeaveId} for {leave.Employee?.FullName} rejected.",
                User.GetUserId());

            return Ok(new { message = "Leave rejected." });
        }

        // DELETE: api/Leaves/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteLeave(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            if (leave == null)
                return NotFound(new { message = "Leave record not found." });

            if (leave.Status == "Approved")
                return BadRequest(new { message = "Cannot delete an already approved leave." });

            _context.Leaves.Remove(leave);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Deleted",
                "Leave",
                $"Leave #{id} deleted.",
                User.GetUserId());

            return NoContent();
        }

        private static LeaveDto MapToDto(Leave l)
        {
            return new LeaveDto
            {
                LeaveId = l.LeaveId,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee != null ? l.Employee.FullName : "",
                LeaveType = l.LeaveType,
                FromDate = l.FromDate,
                ToDate = l.ToDate,
                Reason = l.Reason,
                Status = l.Status,
                DecisionDate = l.DecisionDate,
                CreatedAt = l.CreatedAt
            };
        }
    }
}