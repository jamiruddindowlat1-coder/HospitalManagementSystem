using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class NursingNote
    {
        [Key]
        public int NursingNoteId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        [Required]
        public int NurseId { get; set; }
        public Nurse? Nurse { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Temperature { get; set; } // in Fahrenheit

        public int Pulse { get; set; } // beats per minute

        [MaxLength(20)]
        public string BloodPressure { get; set; } = string.Empty; // e.g. "120/80"

        public int Respiration { get; set; } // breaths per minute

        [Column(TypeName = "decimal(18,2)")]
        public decimal Oxygen { get; set; } // Oxygen saturation %

        [Column(TypeName = "decimal(18,2)")]
        public decimal Weight { get; set; } // in kg

        [MaxLength(500)]
        public string Medicine { get; set; } = string.Empty; // administered medicines

        [MaxLength(1000)]
        public string Observation { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Remark { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
