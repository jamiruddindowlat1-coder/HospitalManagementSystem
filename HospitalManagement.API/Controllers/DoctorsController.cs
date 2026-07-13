using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public DoctorsController(ApplicationDbContext context, IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DoctorDto>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Department)
                .Select(d => new DoctorDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.Department != null ? d.Department.DepartmentName : string.Empty,
                    PhoneNumber = d.PhoneNumber,
                    Email = d.Email,
                    Qualification = d.Qualification,
                    ExperienceYears = d.ExperienceYears,
                    ConsultationFee = d.ConsultationFee,
                    IsAvailable = d.IsAvailable,
                    CreatedAt = d.CreatedAt
                })
                .ToListAsync();

            return doctors;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DoctorDto>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Department)
                .Where(d => d.DoctorId == id)
                .Select(d => new DoctorDto
                {
                    DoctorId = d.DoctorId,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.Department != null ? d.Department.DepartmentName : string.Empty,
                    PhoneNumber = d.PhoneNumber,
                    Email = d.Email,
                    Qualification = d.Qualification,
                    ExperienceYears = d.ExperienceYears,
                    ConsultationFee = d.ConsultationFee,
                    IsAvailable = d.IsAvailable,
                    CreatedAt = d.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (doctor == null) return NotFound();
            return doctor;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<DoctorDto>> CreateDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            var department = await _context.Departments.FindAsync(doctor.DepartmentId);

            await _activityLog.LogAsync("Created", "Doctor", $"Doctor {doctor.FullName} added", User.GetUserId());

            var dto = new DoctorDto
            {
                DoctorId = doctor.DoctorId,
                FullName = doctor.FullName,
                Specialization = doctor.Specialization,
                DepartmentId = doctor.DepartmentId,
                DepartmentName = department?.DepartmentName ?? string.Empty,
                PhoneNumber = doctor.PhoneNumber,
                Email = doctor.Email,
                Qualification = doctor.Qualification,
                ExperienceYears = doctor.ExperienceYears,
                ConsultationFee = doctor.ConsultationFee,
                IsAvailable = doctor.IsAvailable,
                CreatedAt = doctor.CreatedAt
            };

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.DoctorId }, dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
        {
            if (id != doctor.DoctorId) return BadRequest();
            _context.Entry(doctor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await _activityLog.LogAsync("Updated", "Doctor", $"Doctor {doctor.FullName} updated", User.GetUserId());
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Doctors.AnyAsync(d => d.DoctorId == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Deleted", "Doctor", $"Doctor {doctor.FullName} deleted", User.GetUserId());

            return NoContent();
        }
    }
}