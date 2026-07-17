namespace HospitalManagement.API.DTOs
{
    public class IncomeDto
    {
        public int IncomeId { get; set; }

        public string Source { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime IncomeDate { get; set; }

        public string? ReferenceNumber { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}