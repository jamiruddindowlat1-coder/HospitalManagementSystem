namespace HospitalManagement.API.DTOs
{
    public class SalaryPaymentDto
    {
        public int SalaryPaymentId { get; set; }

        public string StaffType { get; set; } = string.Empty;

        public int StaffId { get; set; }

        public string StaffName { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string PaymentMonth { get; set; } = string.Empty;

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}