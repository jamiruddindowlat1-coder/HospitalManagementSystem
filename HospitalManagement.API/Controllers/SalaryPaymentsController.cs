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
    public class SalaryPaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;


        public SalaryPaymentsController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }



        // ==========================================
        // GET: api/SalaryPayments
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalaryPaymentDto>>> GetSalaryPayments()
        {
            var payments = await _context.SalaryPayments
                .OrderByDescending(x => x.PaymentDate)
                .ToListAsync();



            var result = payments.Select(x => new SalaryPaymentDto
            {
                SalaryPaymentId = x.SalaryPaymentId,
                StaffType = x.StaffType,
                StaffId = x.StaffId,
                StaffName = x.StaffName,
                Amount = x.Amount,
                PaymentMonth = x.PaymentMonth,
                PaymentDate = x.PaymentDate,
                Status = x.Status,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            });



            return Ok(result);
        }




        // ==========================================
        // GET: api/SalaryPayments/{id}
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SalaryPaymentDto>> GetSalaryPayment(int id)
        {
            var payment = await _context.SalaryPayments
                .FirstOrDefaultAsync(x => x.SalaryPaymentId == id);



            if (payment == null)
                return NotFound();




            var dto = new SalaryPaymentDto
            {
                SalaryPaymentId = payment.SalaryPaymentId,
                StaffType = payment.StaffType,
                StaffId = payment.StaffId,
                StaffName = payment.StaffName,
                Amount = payment.Amount,
                PaymentMonth = payment.PaymentMonth,
                PaymentDate = payment.PaymentDate,
                Status = payment.Status,
                Notes = payment.Notes,
                CreatedAt = payment.CreatedAt
            };



            return Ok(dto);
        }
                // ==========================================
        // POST: api/SalaryPayments
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateSalaryPayment(
            CreateSalaryPaymentDto dto)
        {
            var payment = new SalaryPayment
            {
                StaffType = dto.StaffType,
                StaffId = dto.StaffId,
                StaffName = dto.StaffName,
                Amount = dto.Amount,
                PaymentMonth = dto.PaymentMonth,
                PaymentDate = dto.PaymentDate,
                Status = dto.Status,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };


            _context.SalaryPayments.Add(payment);

            await _context.SaveChangesAsync();



            await _activityLog.LogAsync(
                "Created",
                "Salary Payment",
                $"Salary payment created for {payment.StaffName}. Amount: {payment.Amount}",
                User.GetUserId());



            return CreatedAtAction(
                nameof(GetSalaryPayment),
                new { id = payment.SalaryPaymentId },
                new SalaryPaymentDto
                {
                    SalaryPaymentId = payment.SalaryPaymentId,
                    StaffType = payment.StaffType,
                    StaffId = payment.StaffId,
                    StaffName = payment.StaffName,
                    Amount = payment.Amount,
                    PaymentMonth = payment.PaymentMonth,
                    PaymentDate = payment.PaymentDate,
                    Status = payment.Status,
                    Notes = payment.Notes,
                    CreatedAt = payment.CreatedAt
                });
        }
                // ==========================================
        // PUT: api/SalaryPayments/{id}
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSalaryPayment(
            int id,
            UpdateSalaryPaymentDto dto)
        {
            var payment = await _context.SalaryPayments
                .FirstOrDefaultAsync(x => x.SalaryPaymentId == id);



            if (payment == null)
                return NotFound();



            payment.StaffType = dto.StaffType;
            payment.StaffId = dto.StaffId;
            payment.StaffName = dto.StaffName;
            payment.Amount = dto.Amount;
            payment.PaymentMonth = dto.PaymentMonth;
            payment.PaymentDate = dto.PaymentDate;
            payment.Status = dto.Status;
            payment.Notes = dto.Notes;



            await _context.SaveChangesAsync();



            await _activityLog.LogAsync(
                "Updated",
                "Salary Payment",
                $"Salary payment for {payment.StaffName} updated.",
                User.GetUserId());



            return NoContent();
        }




        // ==========================================
        // DELETE: api/SalaryPayments/{id}
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSalaryPayment(int id)
        {
            var payment = await _context.SalaryPayments
                .FirstOrDefaultAsync(x => x.SalaryPaymentId == id);



            if (payment == null)
                return NotFound();



            _context.SalaryPayments.Remove(payment);

            await _context.SaveChangesAsync();



            await _activityLog.LogAsync(
                "Deleted",
                "Salary Payment",
                $"Salary payment for {payment.StaffName} deleted.",
                User.GetUserId());



            return NoContent();
        }

    }
}