using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public PatientsController(ApplicationDbContext context, IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        // GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            return await _context.Patients.ToListAsync();
        }

        // GET: api/patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return patient;
        }

        // POST: api/patients
        [Authorize(Roles = "Admin,Receptionist,Nurse")]
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Created", "Patient", $"Patient {patient.FullName} added", User.GetUserId());

            return CreatedAtAction(nameof(GetPatient), new { id = patient.PatientId }, patient);
        }

        // PUT: api/patients/5
        [Authorize(Roles = "Admin,Receptionist,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            if (id != patient.PatientId)
            {
                return BadRequest();
            }

            _context.Entry(patient).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await _activityLog.LogAsync("Updated", "Patient", $"Patient {patient.FullName} updated", User.GetUserId());
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Patients.AnyAsync(p => p.PatientId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/patients/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Deleted", "Patient", $"Patient {patient.FullName} deleted", User.GetUserId());

            return NoContent();
        }
    }
}