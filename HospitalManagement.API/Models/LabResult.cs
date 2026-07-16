using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class LabResult
    {
        [Key]
        public int LabResultId { get; set; }

        public int PatientId { get; set; }

        public int LabTestId { get; set; }

        public string Result { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.Now;


        // Navigation

        public Patient? Patient { get; set; }

        public LabTest? LabTest { get; set; }
    }
}