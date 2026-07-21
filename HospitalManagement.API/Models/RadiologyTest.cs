using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class RadiologyTest
    {
        [Key]
        public int RadiologyTestId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        [Required]
        public int DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        [Required]
        [MaxLength(100)]
        public string TestType { get; set; } = string.Empty; // X-Ray, MRI, CT Scan, USG, ECG, Echo

        [Required]
        public DateTime RequestDate { get; set; } = DateTime.Now;

        public DateTime? ReportDate { get; set; }

        [MaxLength(2000)]
        public string Findings { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty; // Mock image URL or path
    }
}
