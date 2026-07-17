using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class SalaryPayment
    {
        [Key]
        public int SalaryPaymentId { get; set; }

        public string StaffType { get; set; } = string.Empty; // "Doctor", "Nurse", "User"

        public int StaffId { get; set; }

        public string StaffName { get; set; } = string.Empty; // denormalized for easy display

        public decimal Amount { get; set; }

        public string PaymentMonth { get; set; } = string.Empty; // e.g. "July 2026"

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "Paid"; // "Paid", "Pending"

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}