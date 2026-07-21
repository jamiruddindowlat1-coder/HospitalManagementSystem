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
    public class NursingNotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NursingNotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetNotes()
        {
            return await _context.NursingNotes
                .Include(nn => nn.Nurse)
                .Include(nn => nn.Patient)
                .Select(nn => new {
                    nursingNoteId = nn.NursingNoteId,
                    patientId = nn.PatientId,
                    patientName = nn.Patient != null ? nn.Patient.FullName : string.Empty,
                    nurseId = nn.NurseId,
                    nurseName = nn.Nurse != null ? nn.Nurse.FullName : string.Empty,
                    temperature = nn.Temperature,
                    pulse = nn.Pulse,
                    bloodPressure = nn.BloodPressure,
                    respiration = nn.Respiration,
                    oxygen = nn.Oxygen,
                    weight = nn.Weight,
                    medicine = nn.Medicine,
                    observation = nn.Observation,
                    remark = nn.Remark,
                    createdDate = nn.CreatedDate
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetNote(int id)
        {
            var nn = await _context.NursingNotes
                .Include(x => x.Nurse)
                .Include(x => x.Patient)
                .Where(x => x.NursingNoteId == id)
                .Select(nn => new {
                    nursingNoteId = nn.NursingNoteId,
                    patientId = nn.PatientId,
                    patientName = nn.Patient != null ? nn.Patient.FullName : string.Empty,
                    nurseId = nn.NurseId,
                    nurseName = nn.Nurse != null ? nn.Nurse.FullName : string.Empty,
                    temperature = nn.Temperature,
                    pulse = nn.Pulse,
                    bloodPressure = nn.BloodPressure,
                    respiration = nn.Respiration,
                    oxygen = nn.Oxygen,
                    weight = nn.Weight,
                    medicine = nn.Medicine,
                    observation = nn.Observation,
                    remark = nn.Remark,
                    createdDate = nn.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (nn == null) return NotFound();
            return nn;
        }

        [HttpPost]
        public async Task<ActionResult<NursingNote>> CreateNote(NursingNote note)
        {
            note.NursingNoteId = 0;
            note.CreatedDate = DateTime.Now;
            _context.NursingNotes.Add(note);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetNote), new { id = note.NursingNoteId }, note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, NursingNote note)
        {
            if (id != note.NursingNoteId) return BadRequest();

            var existing = await _context.NursingNotes.FindAsync(id);
            if (existing == null) return NotFound();

            existing.PatientId = note.PatientId;
            existing.NurseId = note.NurseId;
            existing.Temperature = note.Temperature;
            existing.Pulse = note.Pulse;
            existing.BloodPressure = note.BloodPressure;
            existing.Respiration = note.Respiration;
            existing.Oxygen = note.Oxygen;
            existing.Weight = note.Weight;
            existing.Medicine = note.Medicine;
            existing.Observation = note.Observation;
            existing.Remark = note.Remark;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.NursingNotes.FindAsync(id);
            if (note == null) return NotFound();

            _context.NursingNotes.Remove(note);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
