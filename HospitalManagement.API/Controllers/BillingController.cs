using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Receptionist")]
    public class BillingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public BillingController(ApplicationDbContext context, IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Billing>>> GetBillings() =>
            await _context.Billings.Include(b => b.Patient).ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Billing>> GetBilling(int id)
        {
            var billing = await _context.Billings.Include(b => b.Patient)
                .FirstOrDefaultAsync(b => b.BillId == id);
            if (billing == null) return NotFound();
            return billing;
        }

        [HttpPost]
        public async Task<ActionResult<Billing>> CreateBilling(Billing billing)
        {
            _context.Billings.Add(billing);
            await _context.SaveChangesAsync();

            var patient = await _context.Patients.FindAsync(billing.PatientId);
            await _activityLog.LogAsync("Created", "Billing",
                $"Bill created for {patient?.FullName} - Status: {billing.PaymentStatus}", null);

            return CreatedAtAction(nameof(GetBilling), new { id = billing.BillId }, billing);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBilling(int id, Billing billing)
        {
            if (id != billing.BillId) return BadRequest();

            var existing = await _context.Billings.AsNoTracking()
                .FirstOrDefaultAsync(b => b.BillId == id);
            var wasPaid = existing?.PaymentStatus == "Paid";

            _context.Entry(billing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var patient = await _context.Patients.FindAsync(billing.PatientId);

            if (!wasPaid && billing.PaymentStatus == "Paid")
            {
                await _activityLog.LogAsync("Paid", "Billing",
                    $"Bill #{billing.BillId} for {patient?.FullName} marked as Paid", null);
            }
            else
            {
                await _activityLog.LogAsync("Updated", "Billing",
                    $"Bill #{billing.BillId} updated", null);
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBilling(int id)
        {
            var billing = await _context.Billings.FindAsync(id);
            if (billing == null) return NotFound();
            _context.Billings.Remove(billing);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Deleted", "Billing",
                $"Bill #{billing.BillId} deleted", null);

            return NoContent();
        }
    }
}