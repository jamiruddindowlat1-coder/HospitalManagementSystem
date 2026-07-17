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
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public ExpenseController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }


        // ==========================================
        // GET: api/Expense
        // ==========================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpenses()
        {
            var expenses = await _context.Expenses
                .OrderByDescending(x => x.ExpenseDate)
                .ToListAsync();


            var result = expenses.Select(x => new ExpenseDto
            {
                ExpenseId = x.ExpenseId,
                Category = x.Category,
                Description = x.Description,
                Amount = x.Amount,
                ExpenseDate = x.ExpenseDate,
                ReferenceNumber = x.ReferenceNumber,
                CreatedAt = x.CreatedAt
            });


            return Ok(result);
        }



        // ==========================================
        // GET: api/Expense/{id}
        // ==========================================

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(x => x.ExpenseId == id);


            if (expense == null)
                return NotFound();



            var dto = new ExpenseDto
            {
                ExpenseId = expense.ExpenseId,
                Category = expense.Category,
                Description = expense.Description,
                Amount = expense.Amount,
                ExpenseDate = expense.ExpenseDate,
                ReferenceNumber = expense.ReferenceNumber,
                CreatedAt = expense.CreatedAt
            };


            return Ok(dto);
        }
                // ==========================================
        // POST: api/Expense
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateExpense(CreateExpenseDto dto)
        {
            var expense = new Expense
            {
                Category = dto.Category,
                Description = dto.Description,
                Amount = dto.Amount,
                ExpenseDate = dto.ExpenseDate,
                ReferenceNumber = dto.ReferenceNumber,
                CreatedAt = DateTime.Now
            };


            _context.Expenses.Add(expense);

            await _context.SaveChangesAsync();



            decimal currentBalance = await _context.LedgerEntries
                .OrderByDescending(x => x.LedgerEntryId)
                .Select(x => (decimal?)x.RunningBalance)
                .FirstOrDefaultAsync() ?? 0;



            var ledgerEntry = new LedgerEntry
            {
                EntryType = "Expense",
                ExpenseId = expense.ExpenseId,
                Description = $"{expense.Category} - {expense.Description}",
                Amount = expense.Amount,
                EntryDate = expense.ExpenseDate,
                RunningBalance = currentBalance - expense.Amount,
                CreatedAt = DateTime.Now
            };


            _context.LedgerEntries.Add(ledgerEntry);

            await _context.SaveChangesAsync();



            await _activityLog.LogAsync(
                "Created",
                "Expense",
                $"Expense '{expense.Category}' added. Amount: {expense.Amount}",
                User.GetUserId());



            return CreatedAtAction(
                nameof(GetExpense),
                new { id = expense.ExpenseId },
                new ExpenseDto
                {
                    ExpenseId = expense.ExpenseId,
                    Category = expense.Category,
                    Description = expense.Description,
                    Amount = expense.Amount,
                    ExpenseDate = expense.ExpenseDate,
                    ReferenceNumber = expense.ReferenceNumber,
                    CreatedAt = expense.CreatedAt
                });
        }
                // ==========================================
        // PUT: api/Expense/{id}
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateExpense(
            int id,
            UpdateExpenseDto dto)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(x => x.ExpenseId == id);


            if (expense == null)
                return NotFound();



            expense.Category = dto.Category;
            expense.Description = dto.Description;
            expense.Amount = dto.Amount;
            expense.ExpenseDate = dto.ExpenseDate;
            expense.ReferenceNumber = dto.ReferenceNumber;



            await _context.SaveChangesAsync();



            var ledgerEntry = await _context.LedgerEntries
                .FirstOrDefaultAsync(x => x.ExpenseId == expense.ExpenseId);



            if (ledgerEntry != null)
            {
                ledgerEntry.Description =
                    $"{expense.Category} - {expense.Description}";

                ledgerEntry.Amount = expense.Amount;
                ledgerEntry.EntryDate = expense.ExpenseDate;


                await _context.SaveChangesAsync();

                await RecalculateLedgerBalances();
            }



            await _activityLog.LogAsync(
                "Updated",
                "Expense",
                $"Expense '{expense.Category}' updated.",
                User.GetUserId());



            return NoContent();
        }





        // ==========================================
        // DELETE: api/Expense/{id}
        // ==========================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(x => x.ExpenseId == id);



            if (expense == null)
                return NotFound();



            var ledgerEntry = await _context.LedgerEntries
                .FirstOrDefaultAsync(x => x.ExpenseId == expense.ExpenseId);



            if (ledgerEntry != null)
            {
                _context.LedgerEntries.Remove(ledgerEntry);
            }



            _context.Expenses.Remove(expense);



            await _context.SaveChangesAsync();



            await RecalculateLedgerBalances();



            await _activityLog.LogAsync(
                "Deleted",
                "Expense",
                $"Expense '{expense.Category}' deleted.",
                User.GetUserId());



            return NoContent();
        }





        // ==========================================
        // Recalculate Ledger Balance
        // ==========================================

        private async Task RecalculateLedgerBalances()
        {
            decimal balance = 0;


            var entries = await _context.LedgerEntries
                .OrderBy(x => x.EntryDate)
                .ThenBy(x => x.LedgerEntryId)
                .ToListAsync();



            foreach (var entry in entries)
            {
                if (entry.EntryType == "Income")
                {
                    balance += entry.Amount;
                }
                else if (entry.EntryType == "Expense")
                {
                    balance -= entry.Amount;
                }


                entry.RunningBalance = balance;
            }



            await _context.SaveChangesAsync();
        }
    }
}