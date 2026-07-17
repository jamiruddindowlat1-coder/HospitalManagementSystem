using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class LedgerEntry
    {
        [Key]
        public int LedgerEntryId { get; set; }

        public string EntryType { get; set; } = string.Empty; // "Income" or "Expense"

        public int? IncomeId { get; set; }
        public int? ExpenseId { get; set; }

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime EntryDate { get; set; } = DateTime.Now;

        public decimal RunningBalance { get; set; } // Balance after this entry

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public Income? Income { get; set; }
        public Expense? Expense { get; set; }
    }
}