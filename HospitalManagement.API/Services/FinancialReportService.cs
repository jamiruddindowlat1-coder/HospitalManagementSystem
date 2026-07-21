using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Services
{

    public interface IFinancialReportService
    {
        Task<FinancialLedgerResultDto> GetLedgerAsync(FinancialLedgerFilterDto filter);

        Task<List<MonthlyIncomeExpenseDto>> GetMonthlyIncomeExpenseAsync(int year);

        Task<List<IncomeByCategoryDto>> GetIncomeByCategoryAsync(
            DateTime startDate,
            DateTime endDate);

        Task<List<ExpenseByCategoryDto>> GetExpenseByCategoryAsync(
            DateTime startDate,
            DateTime endDate);

        Task<List<TopExpenseDto>> GetTopExpensesAsync(
            DateTime startDate,
            DateTime endDate,
            int topN = 10);

        Task<ProfitLossSummaryDto> GetProfitLossSummaryAsync(
            DateTime startDate,
            DateTime endDate);
    }



    public class FinancialReportService : IFinancialReportService
    {

        private readonly ApplicationDbContext _context;


        public FinancialReportService(ApplicationDbContext context)
        {
            _context = context;
        }



        private static DateTime EndOfDay(DateTime date)
        {
            return date.Date.AddDays(1).AddTicks(-1);
        }



        // ================================
        // Monthly Chart
        // ================================

        public async Task<List<MonthlyIncomeExpenseDto>> GetMonthlyIncomeExpenseAsync(int year)
        {

            var income = await _context.Billings
                .Where(x => x.BillDate.Year == year)
                .GroupBy(x => x.BillDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Amount = g.Sum(x => x.TotalAmount)
                })
                .ToListAsync();



            var expense = await _context.Expenses
                .Where(x => x.ExpenseDate.Year == year)
                .GroupBy(x => x.ExpenseDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Amount = g.Sum(x => x.Amount)
                })
                .ToListAsync();



            var result = new List<MonthlyIncomeExpenseDto>();


            for(int i=1;i<=12;i++)
            {
                result.Add(new MonthlyIncomeExpenseDto
                {
                    Month = new DateTime(year,i,1)
                    .ToString("MMM"),

                    Income = income
                    .FirstOrDefault(x=>x.Month==i)
                    ?.Amount ?? 0,


                    Expense = expense
                    .FirstOrDefault(x=>x.Month==i)
                    ?.Amount ?? 0
                });
            }


            return result;
        }





        // ================================
        // Income Category
        // ================================

        public async Task<List<IncomeByCategoryDto>> GetIncomeByCategoryAsync(
            DateTime startDate,
            DateTime endDate)
        {

            var bills = await _context.Billings
            .Where(x=>x.BillDate>=startDate &&
                       x.BillDate<=EndOfDay(endDate))
            .ToListAsync();



            return new List<IncomeByCategoryDto>
            {

                new()
                {
                    Category="Consultation Fee",
                    TotalAmount=bills.Sum(x=>x.ConsultationFee)
                },


                new()
                {
                    Category="Room Charge",
                    TotalAmount=bills.Sum(x=>x.RoomCharge)
                },


                new()
                {
                    Category="Medicine Charge",
                    TotalAmount=bills.Sum(x=>x.MedicineCharge)
                },


                new()
                {
                    Category="Other Charges",
                    TotalAmount=bills.Sum(x=>x.OtherCharges)
                }

            }
            .Where(x=>x.TotalAmount>0)
            .ToList();

        }





        // ================================
        // Expense Category
        // ================================

        public async Task<List<ExpenseByCategoryDto>> GetExpenseByCategoryAsync(
            DateTime startDate,
            DateTime endDate)
        {

            return await _context.Expenses

            .Where(x=>x.ExpenseDate>=startDate &&
                       x.ExpenseDate<=EndOfDay(endDate))

            .GroupBy(x=>x.Category)

            .Select(g=>new ExpenseByCategoryDto
            {
                Category=g.Key,
                TotalAmount=g.Sum(x=>x.Amount),
                TransactionCount=g.Count()

            })

            .ToListAsync();

        }





        // ================================
        // Top Expenses
        // ================================

        public async Task<List<TopExpenseDto>> GetTopExpensesAsync(
            DateTime startDate,
            DateTime endDate,
            int topN=10)
        {


            return await _context.Expenses

            .Where(x=>x.ExpenseDate>=startDate &&
                       x.ExpenseDate<=EndOfDay(endDate))

            .OrderByDescending(x=>x.Amount)

            .Take(topN)

            .Select(x=>new TopExpenseDto
            {

                ExpenseId=x.ExpenseId,

                Category=x.Category,

                Description=x.Description,

                Amount=x.Amount,

                ExpenseDate=x.ExpenseDate

            })

            .ToListAsync();

        }





        // ================================
        // Profit Loss
        // ================================


        public async Task<ProfitLossSummaryDto>
        GetProfitLossSummaryAsync(
            DateTime startDate,
            DateTime endDate)
        {


            var income =
            await _context.Billings

            .Where(x=>x.BillDate>=startDate &&
                       x.BillDate<=EndOfDay(endDate))

            .SumAsync(x=>x.TotalAmount);



            var expense =
            await _context.Expenses

            .Where(x=>x.ExpenseDate>=startDate &&
                       x.ExpenseDate<=EndOfDay(endDate))

            .SumAsync(x=>x.Amount);



            return new ProfitLossSummaryDto
            {

                TotalIncome=income,

                TotalExpense=expense,

                NetProfitLoss=income-expense,

                StartDate=startDate,

                EndDate=endDate

            };


        }





        // ================================
        // Ledger
        // ================================


        public async Task<FinancialLedgerResultDto>
        GetLedgerAsync(FinancialLedgerFilterDto filter)
        {


            var data = new List<FinancialLedgerEntryDto>();


            var bills = await _context.Billings.ToListAsync();


            foreach(var b in bills)
            {

                data.Add(new FinancialLedgerEntryDto
                {
                    Id=b.BillId,

                    Type="Income",

                    Category="Billing",

                    Description=$"Bill #{b.BillId}",

                    Amount=b.TotalAmount,

                    Date=b.BillDate
                });

            }




            var expenses = await _context.Expenses.ToListAsync();


            foreach(var e in expenses)
            {

                data.Add(new FinancialLedgerEntryDto
                {

                    Id=e.ExpenseId,

                    Type="Expense",

                    Category=e.Category,

                    Description=e.Description,

                    Amount=e.Amount,

                    Date=e.ExpenseDate

                });

            }



            data=data
            .OrderByDescending(x=>x.Date)
            .ToList();



            return new FinancialLedgerResultDto
            {

                Entries=data,

                TotalCount=data.Count,

                PageNumber=1,

                PageSize=data.Count

            };


        }



    }

}