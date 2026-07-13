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
    public class AdmissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public AdmissionsController(ApplicationDbContext context, IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }


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
                Status = dto.Status == "Discharged" ? "Discharged" : "Admitted"
            };

            _context.Admissions.Add(admission);
            await _context.SaveChangesAsync();

            await SyncRoomOccupancy(admission.RoomId);

            var patient = await _context.Patients.FindAsync(admission.PatientId);
            var room = await _context.Rooms.FindAsync(admission.RoomId);
            await _activityLog.LogAsync("Created", "Admission",
                $"Patient {patient?.FullName} admitted to Room {room?.RoomNumber}", User.GetUserId());

            return Ok(admission);
        }


        [Authorize(Roles = "Admin,Receptionist,Nurse")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmission(int id, AdmissionCreateDto dto)
        {
            var admission = await _context.Admissions.FindAsync(id);

            if (admission == null)
                return NotFound();

            var oldRoomId = admission.RoomId;
            var wasDischarged = admission.Status == "Discharged";

            admission.PatientId = dto.PatientId;
            admission.RoomId = dto.RoomId;
            admission.DoctorId = dto.DoctorId;
            admission.AdmissionDate = dto.AdmissionDate;
            admission.DischargeDate = dto.DischargeDate;
            admission.Status = dto.Status == "Discharged" ? "Discharged" : "Admitted";

            await _context.SaveChangesAsync();

            await SyncRoomOccupancy(oldRoomId);
            if (oldRoomId != admission.RoomId)
                await SyncRoomOccupancy(admission.RoomId);

            var patient = await _context.Patients.FindAsync(admission.PatientId);

            if (!wasDischarged && admission.Status == "Discharged")
            {
                await _activityLog.LogAsync("Discharged", "Admission",
                    $"Patient {patient?.FullName} discharged", User.GetUserId());
            }
            else
            {
                await _activityLog.LogAsync("Updated", "Admission",
                    $"Admission for {patient?.FullName} updated", User.GetUserId());
            }

            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdmission(int id)
        {
            var admission = await _context.Admissions.FindAsync(id);

            if (admission == null)
                return NotFound();

            var roomId = admission.RoomId;

            _context.Admissions.Remove(admission);
            await _context.SaveChangesAsync();

            await SyncRoomOccupancy(roomId);

            await _activityLog.LogAsync("Deleted", "Admission",
                $"Admission #{admission.AdmissionId} deleted", User.GetUserId());

            return NoContent();
        }


        private async Task SyncRoomOccupancy(int roomId)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
                return;

            bool hasActiveAdmission = await _context.Admissions
                .AnyAsync(a => a.RoomId == roomId && a.Status == "Admitted");

            room.IsOccupied = hasActiveAdmission;

            await _context.SaveChangesAsync();
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("sync-room-status")]
        public async Task<IActionResult> SyncAllRoomStatus()
        {
            var rooms = await _context.Rooms.ToListAsync();

            foreach (var room in rooms)
            {
                bool hasActiveAdmission = await _context.Admissions
                    .AnyAsync(a => a.RoomId == room.RoomId && a.Status == "Admitted");
                room.IsOccupied = hasActiveAdmission;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Room occupancy synced successfully.", roomsUpdated = rooms.Count });
        }
    }
}