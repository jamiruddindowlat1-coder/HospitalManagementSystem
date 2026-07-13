using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Doctor")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordsController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecords()
        {
            return await _context.MedicalRecords

                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Patient)

                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Doctor)

                .ToListAsync();
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecord>> GetMedicalRecord(int id)
        {
            var record = await _context.MedicalRecords

                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Patient)

                .Include(m => m.Appointment)
                    .ThenInclude(a => a.Doctor)

                .FirstOrDefaultAsync(
                    m => m.RecordId == id
                );


            if(record == null)
                return NotFound();


            return record;
        }



        [Authorize(Roles = "Doctor")]
        [HttpPost]
        public async Task<ActionResult<MedicalRecord>> CreateMedicalRecord(
            MedicalRecord record)
        {

            _context.MedicalRecords.Add(record);

            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(GetMedicalRecord),
                new { id = record.RecordId },
                record
            );
        }



        [Authorize(Roles = "Doctor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalRecord(
            int id,
            MedicalRecord record)
        {

            if(id != record.RecordId)
                return BadRequest();


            _context.Entry(record).State =
                EntityState.Modified;


            await _context.SaveChangesAsync();


            return NoContent();
        }



        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {

            var record =
                await _context.MedicalRecords.FindAsync(id);


            if(record == null)
                return NotFound();


            _context.MedicalRecords.Remove(record);


            await _context.SaveChangesAsync();


            return NoContent();
        }
    }
}