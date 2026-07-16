using HospitalManagement.API.Data;
using HospitalManagement.API.Services.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ReportExportService _exportService;


        public ReportsController(
            ApplicationDbContext context,
            ReportExportService exportService)
        {
            _context = context;
            _exportService = exportService;
        }



        // ==========================
        // PATIENT REPORT
        // ==========================

        [HttpGet("patients")]
        public async Task<IActionResult> GetPatients()
        {
            var data = await _context.Patients
                .OrderBy(x => x.PatientId)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // DOCTOR REPORT
        // ==========================

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var data = await _context.Doctors
                .OrderBy(x => x.DoctorId)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // APPOINTMENT REPORT
        // ==========================

        [HttpGet("appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var data = await _context.Appointments
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .OrderByDescending(x => x.AppointmentDate)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // ADMISSION REPORT
        // ==========================

        [HttpGet("admissions")]
        public async Task<IActionResult> GetAdmissions()
        {
            var data = await _context.Admissions
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .OrderByDescending(x => x.AdmissionDate)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // MEDICINE REPORT
        // ==========================

        [HttpGet("medicines")]
        public async Task<IActionResult> GetMedicines()
        {
            var data = await _context.Medicines
                .OrderBy(x => x.MedicineId)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // BILLING REPORT
        // ==========================

        [HttpGet("billing")]
        public async Task<IActionResult> GetBilling()
        {
            var data = await _context.Billings
                .OrderByDescending(x => x.BillDate)
                .ToListAsync();

            return Ok(data);
        }



        // ==========================
        // MEDICAL RECORD REPORT
        // ==========================

     [HttpGet("medicalrecords")]
        public async Task<IActionResult> GetMedicalRecords()
        {
            var data = await _context.MedicalRecords
                .Include(x => x.Appointment)
                .ThenInclude(x => x.Patient)

                .Include(x => x.Appointment)
                .ThenInclude(x => x.Doctor)

                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    MedicalRecordId = x.MedicalRecordId,
                    appointmentId = x.AppointmentId,
                    patientName = x.Appointment != null && x.Appointment.Patient != null ? x.Appointment.Patient.FullName : "-",
                    doctorName = x.Appointment != null && x.Appointment.Doctor != null ? x.Appointment.Doctor.FullName : "-",
                    diagnosis = x.Diagnosis,
                    prescription = x.Prescription,
                    notes = x.Notes,
                    createdAt = x.CreatedAt
                })
                .ToListAsync();


            return Ok(data);
        }




        // ==========================
        // PDF EXPORT
        // ==========================

        [HttpGet("patients/pdf")]
        public async Task<IActionResult> ExportPatientsPdf()
        {
            var patients = await _context.Patients
                .OrderBy(x => x.PatientId)
                .ToListAsync();


            var pdf = _exportService.GeneratePdf(
                "Patients Report",
                patients
            );


            return File(
                pdf,
                "application/pdf",
                "Patients_Report.pdf"
            );
        }





        // ==========================
        // EXCEL EXPORT
        // ==========================

        [HttpGet("patients/excel")]
        public async Task<IActionResult> ExportPatientsExcel()
        {
            var patients = await _context.Patients
                .OrderBy(x => x.PatientId)
                .ToListAsync();


            var excel = _exportService.GenerateExcel(
                "Patients Report",
                patients
            );


            return File(
                excel,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Patients_Report.xlsx"
            );
        }

    }
}