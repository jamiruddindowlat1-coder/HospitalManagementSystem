namespace HospitalManagement.API.DTOs
{
    public class UpdateIncomeDto
    {
        public string Source { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime IncomeDate { get; set; }

        public string? ReferenceNumber { get; set; }
    }
}