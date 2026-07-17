namespace HospitalManagement.API.DTOs
{
    public class CreateSalaryPaymentDto
    {
        public string StaffType { get; set; } = string.Empty;

        public int StaffId { get; set; }

        public string StaffName { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string PaymentMonth { get; set; } = string.Empty;

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "Paid";

        public string? Notes { get; set; }
    }
}