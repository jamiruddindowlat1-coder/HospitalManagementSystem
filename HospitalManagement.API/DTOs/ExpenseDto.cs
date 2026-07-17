namespace HospitalManagement.API.DTOs
{
    public class ExpenseDto
    {
        public int ExpenseId { get; set; }

        public string Category { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime ExpenseDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}