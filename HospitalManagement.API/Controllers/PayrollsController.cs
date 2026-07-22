using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PayrollsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public PayrollsController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        // GET: api/Payrolls
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayrollDto>>> GetPayrolls()
        {
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .OrderByDescending(p => p.Year)
                .ThenByDescending(p => p.Month)
                .ToListAsync();

            return Ok(payrolls.Select(MapToDto));
        }

        // GET: api/Payrolls/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayrollDto>> GetPayroll(int id)
        {
            var payroll = await _context.Payrolls
                .Include(p => p.Employee)
                .FirstOrDefaultAsync(p => p.PayrollId == id);

            if (payroll == null)
                return NotFound(new { message = "Payroll record not found." });

            return Ok(MapToDto(payroll));
        }

        // POST: api/Payrolls
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PayrollDto>> CreatePayroll(PayrollCreateDto dto)
        {
            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null)
                return BadRequest(new { message = "Employee not found." });

            bool exists = await _context.Payrolls.AnyAsync(p =>
                p.EmployeeId == dto.EmployeeId &&
                p.Month == dto.Month &&
                p.Year == dto.Year);

            if (exists)
                return BadRequest(new { message = "Payroll already generated for this employee in this month." });

            decimal basicSalary = employee.Salary;

            decimal grossSalary = basicSalary
                + dto.HouseRentAllowance
                + dto.MedicalAllowance
                + dto.TransportAllowance
                + dto.OtherAllowance;

            decimal totalDeductions = dto.ProvidentFund
                + dto.TaxDeduction
                + dto.AbsenceDeduction
                + dto.OtherDeduction;

            decimal netSalary = grossSalary - totalDeductions;

            var payroll = new Payroll
            {
                EmployeeId = dto.EmployeeId,
                Month = dto.Month,
                Year = dto.Year,
                BasicSalary = basicSalary,
                HouseRentAllowance = dto.HouseRentAllowance,
                MedicalAllowance = dto.MedicalAllowance,
                TransportAllowance = dto.TransportAllowance,
                OtherAllowance = dto.OtherAllowance,
                ProvidentFund = dto.ProvidentFund,
                TaxDeduction = dto.TaxDeduction,
                AbsenceDeduction = dto.AbsenceDeduction,
                OtherDeduction = dto.OtherDeduction,
                GrossSalary = grossSalary,
                TotalDeductions = totalDeductions,
                NetSalary = netSalary,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Payrolls.Add(payroll);
            await _context.SaveChangesAsync();

            await _context.Entry(payroll).Reference(p => p.Employee).LoadAsync();

            await _activityLog.LogAsync(
                "Created",
                "Payroll",
                $"Payroll generated for {payroll.Employee?.FullName} - {payroll.Month}/{payroll.Year}. Net: {payroll.NetSalary}",
                User.GetUserId());

            return CreatedAtAction(nameof(GetPayroll), new { id = payroll.PayrollId }, MapToDto(payroll));
        }

        // PUT: api/Payrolls/5/mark-paid
        [HttpPut("{id}/mark-paid")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsPaid(int id)
        {
            var payroll = await _context.Payrolls
                .Include(p => p.Employee)
                .FirstOrDefaultAsync(p => p.PayrollId == id);

            if (payroll == null)
                return NotFound(new { message = "Payroll record not found." });

            if (payroll.Status == "Paid")
                return BadRequest(new { message = "This payroll is already marked as paid." });

            payroll.Status = "Paid";
            payroll.PaidDate = DateTime.UtcNow;

            string[] monthNames = {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            };
            string paymentMonth = $"{monthNames[payroll.Month - 1]} {payroll.Year}";

            var salaryPayment = new SalaryPayment
            {
                StaffType = "Employee",
                StaffId = payroll.EmployeeId,
                StaffName = payroll.Employee != null ? payroll.Employee.FullName : "",
                Amount = payroll.NetSalary,
                PaymentMonth = paymentMonth,
                PaymentDate = DateTime.Now,
                Status = "Paid",
                Notes = $"Auto-generated from Payroll #{payroll.PayrollId}",
                CreatedAt = DateTime.Now
            };

            _context.SalaryPayments.Add(salaryPayment);

            // Ledger entry, same pattern as SalaryPaymentsController
            var currentBalance = await _context.LedgerEntries
                .OrderByDescending(x => x.LedgerEntryId)
                .Select(x => (decimal?)x.RunningBalance)
                .FirstOrDefaultAsync() ?? 0;

            var ledger = new LedgerEntry
            {
                EntryType = "Expense",
                Description = $"Salary payment - {salaryPayment.StaffName}",
                Amount = salaryPayment.Amount,
                EntryDate = salaryPayment.PaymentDate,
                RunningBalance = currentBalance - salaryPayment.Amount,
                CreatedAt = DateTime.Now
            };

            _context.LedgerEntries.Add(ledger);

            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Updated",
                "Payroll",
                $"Payroll #{payroll.PayrollId} for {salaryPayment.StaffName} marked as paid. Amount: {salaryPayment.Amount}",
                User.GetUserId());

            return Ok(new { message = "Payroll marked as paid and salary payment recorded." });
        }

        // DELETE: api/Payrolls/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePayroll(int id)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll == null)
                return NotFound(new { message = "Payroll record not found." });

            if (payroll.Status == "Paid")
                return BadRequest(new { message = "Cannot delete a payroll that has already been paid." });

            _context.Payrolls.Remove(payroll);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Deleted",
                "Payroll",
                $"Payroll #{id} deleted.",
                User.GetUserId());

            return NoContent();
        }

        private static PayrollDto MapToDto(Payroll p)
        {
            return new PayrollDto
            {
                PayrollId = p.PayrollId,
                EmployeeId = p.EmployeeId,
                EmployeeName = p.Employee != null ? p.Employee.FullName : "",
                Month = p.Month,
                Year = p.Year,
                BasicSalary = p.BasicSalary,
                HouseRentAllowance = p.HouseRentAllowance,
                MedicalAllowance = p.MedicalAllowance,
                TransportAllowance = p.TransportAllowance,
                OtherAllowance = p.OtherAllowance,
                ProvidentFund = p.ProvidentFund,
                TaxDeduction = p.TaxDeduction,
                AbsenceDeduction = p.AbsenceDeduction,
                OtherDeduction = p.OtherDeduction,
                GrossSalary = p.GrossSalary,
                TotalDeductions = p.TotalDeductions,
                NetSalary = p.NetSalary,
                Status = p.Status,
                PaidDate = p.PaidDate,
                CreatedAt = p.CreatedAt
            };
        }
    }
}