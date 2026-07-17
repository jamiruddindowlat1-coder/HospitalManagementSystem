namespace HospitalManagement.API.DTOs
{
    public class CreateIncomeDto
    {
        public string Source { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime IncomeDate { get; set; } = DateTime.Now;

        public string? ReferenceNumber { get; set; }
    }
}