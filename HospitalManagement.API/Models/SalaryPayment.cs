using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class SalaryPayment
    {
        [Key]
        public int SalaryPaymentId { get; set; }

        [Required]
        [MaxLength(50)]
        public string StaffType { get; set; } = string.Empty;

        [Required]
        public int StaffId { get; set; }

        // Snapshot of the staff name at the time of payment
        [Required]
        [MaxLength(100)]
        public string StaffName { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(20)]
        public string PaymentMonth { get; set; } = string.Empty; // e.g. "July 2026"

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Paid"; // Paid / Pending

        [MaxLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}