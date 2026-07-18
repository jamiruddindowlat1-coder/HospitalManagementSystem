using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountsDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalIncome = await _context.Incomes.SumAsync(x => (decimal?)x.Amount) ?? 0;
            var totalExpense = await _context.Expenses.SumAsync(x => (decimal?)x.Amount) ?? 0;
            var totalSalary = await _context.SalaryPayments.SumAsync(x => (decimal?)x.Amount) ?? 0;
            var balance = totalIncome - totalExpense - totalSalary;

            var todayIncome = await _context.Incomes.Where(x => x.IncomeDate.Date == DateTime.Today).SumAsync(x => (decimal?)x.Amount) ?? 0;
            var todayExpense = await _context.Expenses.Where(x => x.ExpenseDate.Date == DateTime.Today).SumAsync(x => (decimal?)x.Amount) ?? 0;
            var todaySalary = await _context.SalaryPayments.Where(x => x.PaymentDate.Date == DateTime.Today).SumAsync(x => (decimal?)x.Amount) ?? 0;

            return Ok(new
            {
                totalIncome,
                totalExpense,
                totalSalary,
                balance,
                todayIncome,
                todayExpense,
                todaySalary
            });
        }


        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReport()
        {
            var income = await _context.Incomes
                .GroupBy(x => new { x.IncomeDate.Year, x.IncomeDate.Month })
                .Select(g => new { year = g.Key.Year, month = g.Key.Month, total = g.Sum(x => x.Amount) })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .ToListAsync();

            var expense = await _context.Expenses
                .GroupBy(x => new { x.ExpenseDate.Year, x.ExpenseDate.Month })
                .Select(g => new { year = g.Key.Year, month = g.Key.Month, total = g.Sum(x => x.Amount) })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .ToListAsync();

            var salary = await _context.SalaryPayments
                .GroupBy(x => new { x.PaymentDate.Year, x.PaymentDate.Month })
                .Select(g => new { year = g.Key.Year, month = g.Key.Month, total = g.Sum(x => x.Amount) })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .ToListAsync();

            return Ok(new { income, expense, salary });
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentTransactions()
        {
            var incomes = await _context.Incomes
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new { type = "Income", title = x.Source, description = x.Description, amount = x.Amount, date = x.IncomeDate })
                .ToListAsync();

            var expenses = await _context.Expenses
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new { type = "Expense", title = x.Category, description = x.Description, amount = x.Amount, date = x.ExpenseDate })
                .ToListAsync();

            var salaries = await _context.SalaryPayments
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new { type = "Salary", title = x.StaffName, description = x.StaffType + " - " + x.PaymentMonth, amount = x.Amount, date = x.PaymentDate })
                .ToListAsync();

            var transactions = incomes
                .Concat(expenses)
                .Concat(salaries)
                .OrderByDescending(x => x.date)
                .Take(10);

            return Ok(transactions);
        }
    }
}
