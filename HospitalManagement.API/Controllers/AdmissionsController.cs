using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdmissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdmissionsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdmissionResponseDto>>> GetAdmissions()
        {
            var admissions = await _context.Admissions
                .Include(a => a.Patient)
                .Include(a => a.Room)
                .Include(a => a.Doctor)
                .ToListAsync();


            var result = admissions.Select(a => new AdmissionResponseDto
            {
                AdmissionId = a.AdmissionId,

                PatientId = a.PatientId,
                PatientName = a.Patient.FullName,

                RoomId = a.RoomId,
                RoomNumber = a.Room.RoomNumber,

                DoctorId = a.DoctorId,
                DoctorName = a.Doctor.FullName,

                AdmissionDate = a.AdmissionDate,
                DischargeDate = a.DischargeDate,

                Status = a.Status
            });


            return Ok(result);
        }



        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<AdmissionResponseDto>> GetAdmission(int id)
        {
            var a = await _context.Admissions
                .Include(x => x.Patient)
                .Include(x => x.Room)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.AdmissionId == id);


            if (a == null)
                return NotFound();


            var result = new AdmissionResponseDto
            {
                AdmissionId = a.AdmissionId,

                PatientId = a.PatientId,
                PatientName = a.Patient.FullName,

                RoomId = a.RoomId,
                RoomNumber = a.Room.RoomNumber,

                DoctorId = a.DoctorId,
                DoctorName = a.Doctor.FullName,

                AdmissionDate = a.AdmissionDate,
                DischargeDate = a.DischargeDate,

                Status = a.Status
            };


            return Ok(result);
        }



        // CREATE
        [Authorize(Roles = "Admin,Receptionist,Nurse")]
        [HttpPost]
        public async Task<ActionResult> CreateAdmission(AdmissionCreateDto dto)
        {

            var admission = new Admission
            {
                PatientId = dto.PatientId,
                RoomId = dto.RoomId,
                DoctorId = dto.DoctorId,

                AdmissionDate = dto.AdmissionDate,
                DischargeDate = dto.DischargeDate,

                Status = dto.Status
            };


            _context.Admissions.Add(admission);

            await _context.SaveChangesAsync();


            return Ok(admission);
        }



        // UPDATE
        [Authorize(Roles = "Admin,Receptionist,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmission(
            int id,
            AdmissionCreateDto dto)
        {

            var admission = await _context.Admissions
                .FindAsync(id);


            if(admission == null)
                return NotFound();


            admission.PatientId = dto.PatientId;
            admission.RoomId = dto.RoomId;
            admission.DoctorId = dto.DoctorId;

            admission.AdmissionDate = dto.AdmissionDate;
            admission.DischargeDate = dto.DischargeDate;

            admission.Status = dto.Status;


            await _context.SaveChangesAsync();


            return NoContent();
        }



        // DELETE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmission(int id)
        {
            var admission = await _context.Admissions
                .FindAsync(id);


            if(admission == null)
                return NotFound();


            _context.Admissions.Remove(admission);

            await _context.SaveChangesAsync();


            return NoContent();
        }
    }
}
