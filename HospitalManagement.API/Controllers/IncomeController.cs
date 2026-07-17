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
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public IncomeController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }

        // ==========================================
        // GET: api/Income
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeDto>>> GetIncomes()
        {
            var incomes = await _context.Incomes
                .OrderByDescending(x => x.IncomeDate)
                .ToListAsync();

            var result = incomes.Select(x => new IncomeDto
            {
                IncomeId = x.IncomeId,
                Source = x.Source,
                Description = x.Description,
                Amount = x.Amount,
                IncomeDate = x.IncomeDate,
                ReferenceNumber = x.ReferenceNumber,
                CreatedAt = x.CreatedAt
            });

            return Ok(result);
        }

        // ==========================================
        // GET: api/Income/{id}
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<IncomeDto>> GetIncome(int id)
        {
            var income = await _context.Incomes
                .FirstOrDefaultAsync(x => x.IncomeId == id);

            if (income == null)
                return NotFound();

            var dto = new IncomeDto
            {
                IncomeId = income.IncomeId,
                Source = income.Source,
                Description = income.Description,
                Amount = income.Amount,
                IncomeDate = income.IncomeDate,
                ReferenceNumber = income.ReferenceNumber,
                CreatedAt = income.CreatedAt
            };

            return Ok(dto);
        }

        // ==========================================
        // POST: api/Income
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateIncome(CreateIncomeDto dto)
        {
            var income = new Income
            {
                Source = dto.Source,
                Description = dto.Description,
                Amount = dto.Amount,
                IncomeDate = dto.IncomeDate,
                ReferenceNumber = dto.ReferenceNumber,
                CreatedAt = DateTime.Now
            };

            _context.Incomes.Add(income);
            await _context.SaveChangesAsync();

            decimal currentBalance = await _context.LedgerEntries
                .OrderByDescending(x => x.LedgerEntryId)
                .Select(x => (decimal?)x.RunningBalance)
                .FirstOrDefaultAsync() ?? 0;

            var ledgerEntry = new LedgerEntry
            {
                EntryType = "Income",
                IncomeId = income.IncomeId,
                Description = $"{income.Source} - {income.Description}",
                Amount = income.Amount,
                EntryDate = income.IncomeDate,
                RunningBalance = currentBalance + income.Amount,
                CreatedAt = DateTime.Now
            };

            _context.LedgerEntries.Add(ledgerEntry);
            await _context.SaveChangesAsync();

            await _activityLog.LogAsync(
                "Created",
                "Income",
                $"Income '{income.Source}' added. Amount: {income.Amount}",
                User.GetUserId());

            return CreatedAtAction(
                nameof(GetIncome),
                new { id = income.IncomeId },
                new IncomeDto
                {
                    IncomeId = income.IncomeId,
                    Source = income.Source,
                    Description = income.Description,
                    Amount = income.Amount,
                    IncomeDate = income.IncomeDate,
                    ReferenceNumber = income.ReferenceNumber,
                    CreatedAt = income.CreatedAt
                });
        }

        // ==========================================
        // PUT (Next Part)
        // ==========================================

        // ==========================================
        // DELETE (Next Part)
        // ==========================================

        // ==========================================
        // Private Helper Methods (Next Part)
        // ==========================================
    }
}