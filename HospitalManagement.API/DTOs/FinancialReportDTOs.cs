namespace HospitalManagement.API.DTOs
{
    // Common request DTO for date range filtering (query params)
    public class ReportDateRangeDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    // Income by Category
    public class IncomeByCategoryDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int TransactionCount { get; set; }
        public decimal Percentage { get; set; } // % of total income
    }

    // Expense by Category
    public class ExpenseByCategoryDto
    {
        public string Category { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int TransactionCount { get; set; }
        public decimal Percentage { get; set; }
    }

    // Top Expenses (individual line items)
    public class TopExpenseDto
    {
        public int ExpenseId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }
    }

    // Profit / Loss Summary
    public class ProfitLossSummaryDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal NetProfitLoss { get; set; } // Income - Expense
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<IncomeByCategoryDto> IncomeBreakdown { get; set; } = new();
        public List<ExpenseByCategoryDto> ExpenseBreakdown { get; set; } = new();
    }

    // NOTE: prefixed with "Financial" because the project already has a separate
    // double-entry Ledger module (Controllers/LedgerController.cs) with its own
    // LedgerEntryDto/LedgerFilterDto/LedgerResultDto (RunningBalance-based).
    // These are a different, simpler "Income+Expense combined view" used only
    // by the Financial Reports screen — do not merge the two.

    // Ledger Advanced Filter (request)
    public class FinancialLedgerFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Category { get; set; }
        public string? Type { get; set; } // "Income" or "Expense"
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public string? Keyword { get; set; } // searches Description
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    // Ledger entry (unified view of Income + Expense) for Financial Reports screen
    public class FinancialLedgerEntryDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // "Income" / "Expense"
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }

    public class FinancialLedgerResultDto
    {
        public List<FinancialLedgerEntryDto> Entries { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}