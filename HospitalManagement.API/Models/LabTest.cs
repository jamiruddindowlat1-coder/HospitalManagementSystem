using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class LabTest
    {
        [Key]
        public int LabTestId { get; set; }

        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public Doctor? Doctor { get; set; }

        [Required]
        public string TestName { get; set; } = string.Empty;

        [Required]
        public string TestType { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Completed

        public DateTime OrderedDate { get; set; } = DateTime.Now;

        public DateTime? ResultDate { get; set; }

        public string? Result { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}