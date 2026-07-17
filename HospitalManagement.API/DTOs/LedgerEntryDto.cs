namespace HospitalManagement.API.DTOs
{
    public class LedgerEntryDto
    {
        public int LedgerEntryId { get; set; }

        public string EntryType { get; set; } = string.Empty;

        public int? IncomeId { get; set; }

        public int? ExpenseId { get; set; }

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime EntryDate { get; set; }

        public decimal RunningBalance { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}