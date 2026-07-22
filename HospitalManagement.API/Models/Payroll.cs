using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class Payroll
    {
        [Key]
        public int PayrollId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }

        // Pay period
        [Required]
        public int Month { get; set; }   // 1-12

        [Required]
        public int Year { get; set; }

        // Earnings
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasicSalary { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal HouseRentAllowance { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MedicalAllowance { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TransportAllowance { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OtherAllowance { get; set; }

        // Deductions
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProvidentFund { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxDeduction { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AbsenceDeduction { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OtherDeduction { get; set; }

        // Calculated (server-side, in controller)
        [Column(TypeName = "decimal(18,2)")]
        public decimal GrossSalary { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDeductions { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal NetSalary { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";  // Pending / Paid

        public DateTime? PaidDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}