using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LedgerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        public LedgerController(ApplicationDbContext context)
        {
            _context = context;
        }



        // ==========================================
        // GET: api/Ledger
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LedgerEntryDto>>> GetLedger()
        {
            var entries = await _context.LedgerEntries
                .Include(x => x.Income)
                .Include(x => x.Expense)
                .OrderByDescending(x => x.EntryDate)
                .ToListAsync();



            var result = entries.Select(x => new LedgerEntryDto
            {
                LedgerEntryId = x.LedgerEntryId,

                EntryType = x.EntryType,

                IncomeId = x.IncomeId,

                ExpenseId = x.ExpenseId,

                Description = x.Description,

                Amount = x.Amount,

                EntryDate = x.EntryDate,

                RunningBalance = x.RunningBalance,

                CreatedAt = x.CreatedAt
            });



            return Ok(result);
        }




        // ==========================================
        // GET: api/Ledger/{id}
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<LedgerEntryDto>> GetLedgerEntry(int id)
        {
            var entry = await _context.LedgerEntries
                .FirstOrDefaultAsync(x => x.LedgerEntryId == id);



            if (entry == null)
                return NotFound();



            var dto = new LedgerEntryDto
            {
                LedgerEntryId = entry.LedgerEntryId,

                EntryType = entry.EntryType,

                IncomeId = entry.IncomeId,

                ExpenseId = entry.ExpenseId,

                Description = entry.Description,

                Amount = entry.Amount,

                EntryDate = entry.EntryDate,

                RunningBalance = entry.RunningBalance,

                CreatedAt = entry.CreatedAt
            };


            return Ok(dto);
        }
                // ==========================================
        // GET: api/Ledger/balance
        // ==========================================

        [HttpGet("balance")]
        public async Task<IActionResult> GetBalance()
        {
            var totalIncome = await _context.Incomes
                .SumAsync(x => (decimal?)x.Amount) ?? 0;


            var totalExpense = await _context.Expenses
                .SumAsync(x => (decimal?)x.Amount) ?? 0;


            var balance = totalIncome - totalExpense;



            return Ok(new
            {
                totalIncome,
                totalExpense,
                balance
            });
        }




        // ==========================================
        // GET: api/Ledger/income
        // ==========================================

        [HttpGet("income")]
        public async Task<ActionResult<IEnumerable<LedgerEntryDto>>> GetIncomeLedger()
        {
            var entries = await _context.LedgerEntries
                .Where(x => x.EntryType == "Income")
                .OrderByDescending(x => x.EntryDate)
                .ToListAsync();



            var result = entries.Select(x => new LedgerEntryDto
            {
                LedgerEntryId = x.LedgerEntryId,
                EntryType = x.EntryType,
                IncomeId = x.IncomeId,
                ExpenseId = x.ExpenseId,
                Description = x.Description,
                Amount = x.Amount,
                EntryDate = x.EntryDate,
                RunningBalance = x.RunningBalance,
                CreatedAt = x.CreatedAt
            });



            return Ok(result);
        }





        // ==========================================
        // GET: api/Ledger/expense
        // ==========================================

        [HttpGet("expense")]
        public async Task<ActionResult<IEnumerable<LedgerEntryDto>>> GetExpenseLedger()
        {
            var entries = await _context.LedgerEntries
                .Where(x => x.EntryType == "Expense")
                .OrderByDescending(x => x.EntryDate)
                .ToListAsync();



            var result = entries.Select(x => new LedgerEntryDto
            {
                LedgerEntryId = x.LedgerEntryId,
                EntryType = x.EntryType,
                IncomeId = x.IncomeId,
                ExpenseId = x.ExpenseId,
                Description = x.Description,
                Amount = x.Amount,
                EntryDate = x.EntryDate,
                RunningBalance = x.RunningBalance,
                CreatedAt = x.CreatedAt
            });



            return Ok(result);
        }
                // ==========================================
        // GET: api/Ledger/filter
        // ==========================================

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<LedgerEntryDto>>> FilterLedger(
            DateTime from,
            DateTime to)
        {
            var entries = await _context.LedgerEntries
                .Where(x =>
                    x.EntryDate >= from &&
                    x.EntryDate <= to)
                .OrderByDescending(x => x.EntryDate)
                .ToListAsync();



            var result = entries.Select(x => new LedgerEntryDto
            {
                LedgerEntryId = x.LedgerEntryId,

                EntryType = x.EntryType,

                IncomeId = x.IncomeId,

                ExpenseId = x.ExpenseId,

                Description = x.Description,

                Amount = x.Amount,

                EntryDate = x.EntryDate,

                RunningBalance = x.RunningBalance,

                CreatedAt = x.CreatedAt
            });



            return Ok(result);
        }





        // ==========================================
        // GET: api/Ledger/summary
        // ==========================================

        [HttpGet("summary")]
        public async Task<IActionResult> GetLedgerSummary()
        {
            var totalIncome = await _context.Incomes
                .SumAsync(x => (decimal?)x.Amount) ?? 0;



            var totalExpense = await _context.Expenses
                .SumAsync(x => (decimal?)x.Amount) ?? 0;



            var currentBalance = totalIncome - totalExpense;



            var todayIncome = await _context.Incomes
                .Where(x => x.IncomeDate.Date == DateTime.Today)
                .SumAsync(x => (decimal?)x.Amount) ?? 0;



            var todayExpense = await _context.Expenses
                .Where(x => x.ExpenseDate.Date == DateTime.Today)
                .SumAsync(x => (decimal?)x.Amount) ?? 0;



            return Ok(new
            {
                totalIncome,
                totalExpense,
                currentBalance,
                todayIncome,
                todayExpense
            });
        }

    }
}