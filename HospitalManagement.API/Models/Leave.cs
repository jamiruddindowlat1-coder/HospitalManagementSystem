using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class Leave
    {
        [Key]
        public int LeaveId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }

        [Required]
        [MaxLength(20)]
        public string LeaveType { get; set; } = string.Empty;  // Casual, Sick, Earned

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [MaxLength(300)]
        public string? Reason { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";  // Pending, Approved, Rejected

        public DateTime? DecisionDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}