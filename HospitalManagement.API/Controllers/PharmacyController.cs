using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PharmacyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PharmacyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("prescriptions")]
        public async Task<IActionResult> GetPrescriptions()
        {
            var records = await _context.MedicalRecords
                .Include(r => r.Patient)
                .Include(r => r.Doctor)
                .Where(r => r.Prescription != null && r.Prescription != "")
                .Select(r => new
                {
                    medicalRecordId = r.MedicalRecordId,
                    diagnosis = r.Diagnosis,
                    prescription = r.Prescription,
                    notes = r.Notes,
                    createdAt = r.CreatedAt,
                    patientId = r.PatientId,
                    patientName = r.Patient != null ? r.Patient.FullName : "Unknown",
                    doctorId = r.DoctorId,
                    doctorName = r.Doctor != null ? r.Doctor.FullName : "Unknown"
                })
                .OrderByDescending(r => r.createdAt)
                .ToListAsync();

            return Ok(records);
        }

        [HttpPost("dispense")]
        public async Task<IActionResult> DispenseMedicine([FromBody] DispenseRequest request)
        {
            if (request == null || request.MedicineId <= 0 || request.Quantity <= 0 || request.PatientId <= 0)
            {
                return BadRequest(new { message = "Invalid dispense request." });
            }

            var medicine = await _context.Medicines.FindAsync(request.MedicineId);
            if (medicine == null)
            {
                return NotFound(new { message = "Medicine not found." });
            }

            if (medicine.StockQuantity < request.Quantity)
            {
                return BadRequest(new { message = $"Insufficient stock. Available: {medicine.StockQuantity} units." });
            }

            // Deduct stock
            medicine.StockQuantity -= request.Quantity;

            // Calculate total medicine charge
            decimal charges = medicine.UnitPrice * request.Quantity;

            // Try to find an unpaid bill for this patient to add medicine charges to, otherwise create one
            var existingBill = await _context.Billings
                .Where(b => b.PatientId == request.PatientId && b.PaymentStatus != "Paid")
                .OrderByDescending(b => b.BillDate)
                .FirstOrDefaultAsync();

            if (existingBill != null)
            {
                existingBill.MedicineCharge += charges;
            }
            else
            {
                // Fetch a default doctor ID to avoid FK validation errors (DoctorId is required by C# model)
                int defaultDoctorId = await _context.Doctors.Select(d => d.DoctorId).FirstOrDefaultAsync();

                var newBill = new Billing
                {
                    PatientId = request.PatientId,
                    DoctorId = defaultDoctorId,
                    ConsultationFee = 0,
                    RoomCharge = 0,
                    MedicineCharge = charges,
                    OtherCharges = 0,
                    PaymentStatus = "Unpaid",
                    BillDate = DateTime.Now,
                    CreatedAt = DateTime.Now
                };
                _context.Billings.Add(newBill);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Medicine dispensed successfully.",
                medicineName = medicine.MedicineName,
                dispensedQty = request.Quantity,
                remainingStock = medicine.StockQuantity,
                chargesAdded = charges
            });
        }
    }

    public class DispenseRequest
    {
        public int PatientId { get; set; }
        public int MedicineId { get; set; }
        public int Quantity { get; set; }
    }
}
