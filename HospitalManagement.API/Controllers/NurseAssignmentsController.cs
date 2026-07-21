using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NurseAssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NurseAssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAssignments()
        {
            return await _context.NurseAssignments
                .Include(na => na.Nurse)
                .Include(na => na.Patient)
                .Select(na => new {
                    nurseAssignmentId = na.NurseAssignmentId,
                    nurseId = na.NurseId,
                    nurseName = na.Nurse != null ? na.Nurse.FullName : string.Empty,
                    patientId = na.PatientId,
                    patientName = na.Patient != null ? na.Patient.FullName : string.Empty,
                    assignedDate = na.AssignedDate,
                    releaseDate = na.ReleaseDate
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetAssignment(int id)
        {
            var na = await _context.NurseAssignments
                .Include(x => x.Nurse)
                .Include(x => x.Patient)
                .Where(x => x.NurseAssignmentId == id)
                .Select(x => new {
                    nurseAssignmentId = x.NurseAssignmentId,
                    nurseId = x.NurseId,
                    nurseName = x.Nurse != null ? x.Nurse.FullName : string.Empty,
                    patientId = x.PatientId,
                    patientName = x.Patient != null ? x.Patient.FullName : string.Empty,
                    assignedDate = x.AssignedDate,
                    releaseDate = x.ReleaseDate
                })
                .FirstOrDefaultAsync();

            if (na == null) return NotFound();
            return na;
        }

        [HttpPost]
        public async Task<ActionResult<NurseAssignment>> CreateAssignment(NurseAssignment assignment)
        {
            assignment.NurseAssignmentId = 0;
            assignment.AssignedDate = DateTime.Now;
            _context.NurseAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAssignment), new { id = assignment.NurseAssignmentId }, assignment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id, NurseAssignment assignment)
        {
            if (id != assignment.NurseAssignmentId) return BadRequest();

            var existing = await _context.NurseAssignments.FindAsync(id);
            if (existing == null) return NotFound();

            existing.NurseId = assignment.NurseId;
            existing.PatientId = assignment.PatientId;
            existing.ReleaseDate = assignment.ReleaseDate;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.NurseAssignments.FindAsync(id);
            if (assignment == null) return NotFound();

            _context.NurseAssignments.Remove(assignment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
