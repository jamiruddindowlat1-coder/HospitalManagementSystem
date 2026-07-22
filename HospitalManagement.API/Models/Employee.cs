using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public int DepartmentId { get; set; }

        [ForeignKey("DepartmentId")]
        public Department? Department { get; set; }

        [Required]
        [MaxLength(50)]
        public string Designation { get; set; } = string.Empty; // Receptionist, Accountant, Nurse, Pharmacist...

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(100)]
        public string? Email { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        [MaxLength(30)]
        public string? NID { get; set; }

        [MaxLength(100)]
        public string? EmergencyContactName { get; set; }

        [MaxLength(20)]
        public string? EmergencyContactPhone { get; set; }

        public DateTime JoiningDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Active"; // Active, Inactive, Resigned

        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}