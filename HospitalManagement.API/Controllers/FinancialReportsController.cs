using ClosedXML.Excel;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // সাধারণত financial reports শুধু Admin দেখবে
    public class FinancialReportsController : ControllerBase
    {
        private readonly IFinancialReportService _reportService;

        public FinancialReportsController(IFinancialReportService reportService)
        {
            _reportService = reportService;
        }

        // GET: api/FinancialReports/income-by-category?startDate=2026-01-01&endDate=2026-07-18
        [HttpGet("income-by-category")]
        public async Task<IActionResult> GetIncomeByCategory([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = await _reportService.GetIncomeByCategoryAsync(startDate, endDate);
            return Ok(result);
        }

        // GET: api/FinancialReports/expense-by-category?startDate=...&endDate=...
        [HttpGet("expense-by-category")]
        public async Task<IActionResult> GetExpenseByCategory([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = await _reportService.GetExpenseByCategoryAsync(startDate, endDate);
            return Ok(result);
        }

        // GET: api/FinancialReports/top-expenses?startDate=...&endDate=...&topN=10
        [HttpGet("top-expenses")]
        public async Task<IActionResult> GetTopExpenses([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int topN = 10)
        {
            var result = await _reportService.GetTopExpensesAsync(startDate, endDate, topN);
            return Ok(result);
        }

        // GET: api/FinancialReports/profit-loss?startDate=...&endDate=...
        [HttpGet("profit-loss")]
        public async Task<IActionResult> GetProfitLoss([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var result = await _reportService.GetProfitLossSummaryAsync(startDate, endDate);
            return Ok(result);
        }
        

        // POST: api/FinancialReports/ledger
        // NOTE: this is the simple Income+Expense combined view for the Financial
        // Reports screen — separate from the existing double-entry LedgerController.
        [HttpPost("ledger")]
        public async Task<IActionResult> GetLedger([FromBody] FinancialLedgerFilterDto filter)
        {
            var result = await _reportService.GetLedgerAsync(filter);
            return Ok(result);
        }

        // GET: api/FinancialReports/export/pdf?startDate=...&endDate=...
        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportProfitLossPdf([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GetProfitLossSummaryAsync(startDate, endDate);

            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header().Text("Financial Report").FontSize(18).Bold();

                    page.Content().Column(col =>
                    {
                        col.Item().Text($"Period: {startDate:dd MMM yyyy} - {endDate:dd MMM yyyy}");
                        col.Item().PaddingTop(10).Text($"Total Income: {report.TotalIncome:N2}").Bold();
                        col.Item().Text($"Total Expense: {report.TotalExpense:N2}").Bold();
                        col.Item().Text($"Net Profit/Loss: {report.NetProfitLoss:N2}").Bold()
                            .FontColor(report.NetProfitLoss >= 0 ? Colors.Green.Darken2 : Colors.Red.Darken2);

                        col.Item().PaddingTop(15).Text("Income by Category").Bold().FontSize(13);
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(); });
                            table.Header(h =>
                            {
                                h.Cell().Text("Category").Bold();
                                h.Cell().Text("Amount").Bold();
                                h.Cell().Text("%").Bold();
                            });
                            foreach (var item in report.IncomeBreakdown)
                            {
                                table.Cell().Text(item.Category);
                                table.Cell().Text(item.TotalAmount.ToString("N2"));
                                table.Cell().Text(item.Percentage + "%");
                            }
                        });

                        col.Item().PaddingTop(15).Text("Expense by Category").Bold().FontSize(13);
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(); });
                            table.Header(h =>
                            {
                                h.Cell().Text("Category").Bold();
                                h.Cell().Text("Amount").Bold();
                                h.Cell().Text("%").Bold();
                            });
                            foreach (var item in report.ExpenseBreakdown)
                            {
                                table.Cell().Text(item.Category);
                                table.Cell().Text(item.TotalAmount.ToString("N2"));
                                table.Cell().Text(item.Percentage + "%");
                            }
                        });
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Generated on ");
                        x.Span(DateTime.Now.ToString("dd MMM yyyy HH:mm"));
                    });
                });
            });

            var pdfBytes = document.GeneratePdf();
            return File(pdfBytes, "application/pdf", $"FinancialReport_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.pdf");
        }

        // GET: api/FinancialReports/export/excel?startDate=...&endDate=...
        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportProfitLossExcel([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var report = await _reportService.GetProfitLossSummaryAsync(startDate, endDate);

            using var workbook = new XLWorkbook();

            // Summary sheet
            var summarySheet = workbook.Worksheets.Add("Summary");
            summarySheet.Cell(1, 1).Value = "Financial Report Summary";
            summarySheet.Cell(1, 1).Style.Font.Bold = true;
            summarySheet.Cell(2, 1).Value = "Period";
            summarySheet.Cell(2, 2).Value = $"{startDate:dd MMM yyyy} - {endDate:dd MMM yyyy}";
            summarySheet.Cell(3, 1).Value = "Total Income";
            summarySheet.Cell(3, 2).Value = report.TotalIncome;
            summarySheet.Cell(4, 1).Value = "Total Expense";
            summarySheet.Cell(4, 2).Value = report.TotalExpense;
            summarySheet.Cell(5, 1).Value = "Net Profit/Loss";
            summarySheet.Cell(5, 2).Value = report.NetProfitLoss;
            summarySheet.Columns().AdjustToContents();

            // Income sheet
            var incomeSheet = workbook.Worksheets.Add("Income by Category");
            incomeSheet.Cell(1, 1).Value = "Category";
            incomeSheet.Cell(1, 2).Value = "Amount";
            incomeSheet.Cell(1, 3).Value = "Transactions";
            incomeSheet.Cell(1, 4).Value = "Percentage";
            incomeSheet.Row(1).Style.Font.Bold = true;
            for (int i = 0; i < report.IncomeBreakdown.Count; i++)
            {
                var item = report.IncomeBreakdown[i];
                incomeSheet.Cell(i + 2, 1).Value = item.Category;
                incomeSheet.Cell(i + 2, 2).Value = item.TotalAmount;
                incomeSheet.Cell(i + 2, 3).Value = item.TransactionCount;
                incomeSheet.Cell(i + 2, 4).Value = item.Percentage;
            }
            incomeSheet.Columns().AdjustToContents();

            // Expense sheet
            var expenseSheet = workbook.Worksheets.Add("Expense by Category");
            expenseSheet.Cell(1, 1).Value = "Category";
            expenseSheet.Cell(1, 2).Value = "Amount";
            expenseSheet.Cell(1, 3).Value = "Transactions";
            expenseSheet.Cell(1, 4).Value = "Percentage";
            expenseSheet.Row(1).Style.Font.Bold = true;
            for (int i = 0; i < report.ExpenseBreakdown.Count; i++)
            {
                var item = report.ExpenseBreakdown[i];
                expenseSheet.Cell(i + 2, 1).Value = item.Category;
                expenseSheet.Cell(i + 2, 2).Value = item.TotalAmount;
                expenseSheet.Cell(i + 2, 3).Value = item.TransactionCount;
                expenseSheet.Cell(i + 2, 4).Value = item.Percentage;
            }
            expenseSheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            var content = stream.ToArray();

            return File(content,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"FinancialReport_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.xlsx");
        }
    }
}