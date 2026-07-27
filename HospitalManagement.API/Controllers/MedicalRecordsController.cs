using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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


        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetMedicalRecords()
        {
            var records = await _context.MedicalRecords
                .Select(m => new
                {
                    medicalRecordId = m.MedicalRecordId,
                    appointmentId = m.AppointmentId,
                    diagnosis = m.Diagnosis,
                    prescription = m.Prescription,
                    notes = m.Notes,
                    createdAt = m.CreatedAt,

                    patientId = m.PatientId,
                    doctorId = m.DoctorId,

                    patientName = m.Patient != null
                        ? m.Patient.FullName
                        : null,

                    doctorName = m.Doctor != null
                        ? m.Doctor.FullName
                        : null
                })
                .ToListAsync();


            return Ok(records);
        }



        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalRecord(int id)
        {
            var record = await _context.MedicalRecords
                .Where(m => m.MedicalRecordId == id)
                .Select(m => new
                {
                    medicalRecordId = m.MedicalRecordId,
                    appointmentId = m.AppointmentId,
                    diagnosis = m.Diagnosis,
                    prescription = m.Prescription,
                    notes = m.Notes,
                    createdAt = m.CreatedAt,

                    patientId = m.PatientId,
                    doctorId = m.DoctorId,

                    patientName = m.Patient != null
                        ? m.Patient.FullName
                        : null,

                    doctorName = m.Doctor != null
                        ? m.Doctor.FullName
                        : null
                })
                .FirstOrDefaultAsync();


            if (record == null)
                return NotFound();


            return Ok(record);
        }




        // CREATE MEDICAL RECORD
        [Authorize(Roles = "Doctor")]
        [HttpPost]
        public async Task<ActionResult<MedicalRecord>> CreateMedicalRecord(
            MedicalRecord record)
        {

            // Logged in User Id
            var userIdClaim = User.FindFirst(
                ClaimTypes.NameIdentifier
            );


            if (userIdClaim == null)
            {
                return Unauthorized();
            }


            int userId = int.Parse(userIdClaim.Value);



            // Find Doctor Profile
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);



            if (doctor == null)
            {
                return BadRequest(
                    "Doctor profile not found."
                );
            }



            // Find Appointment
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.AppointmentId == record.AppointmentId
                );



            if (appointment == null)
            {
                return BadRequest(
                    "Appointment not found."
                );
            }



            // Auto assign Doctor & Patient
            record.DoctorId = doctor.DoctorId;

            record.PatientId = appointment.PatientId;



            record.MedicalRecordId = 0;

            record.CreatedAt = DateTime.Now;



            _context.MedicalRecords.Add(record);

            await _context.SaveChangesAsync();



            return CreatedAtAction(
                nameof(GetMedicalRecord),
                new
                {
                    id = record.MedicalRecordId
                },
                record
            );
        }





        // UPDATE
        [Authorize(Roles = "Doctor,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalRecord(
            int id,
            MedicalRecord record)
        {

            var existing =
                await _context.MedicalRecords.FindAsync(id);



            if (existing == null)
                return NotFound();



            existing.AppointmentId =
                record.AppointmentId;

            existing.Diagnosis =
                record.Diagnosis;

            existing.Prescription =
                record.Prescription;

            existing.Notes =
                record.Notes;



            await _context.SaveChangesAsync();


            return NoContent();
        }





        // DELETE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(
            int id)
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
