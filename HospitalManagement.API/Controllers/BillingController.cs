using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Receptionist")]
    public class BillingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BillingController(ApplicationDbContext context) => _context = context;

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
            return CreatedAtAction(nameof(GetBilling), new { id = billing.BillId }, billing);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBilling(int id, Billing billing)
        {
            if (id != billing.BillId) return BadRequest();
            _context.Entry(billing).State = EntityState.Modified;
            await _context.SaveChangesAsync();
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
            return NoContent();
        }
    }
}
