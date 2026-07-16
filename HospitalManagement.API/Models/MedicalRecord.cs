using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class MedicalRecord
    {
        [Key]
        public int MedicalRecordId { get; set; }


        // Appointment Relation
        public int AppointmentId { get; set; }

        public Appointment? Appointment { get; set; }


        // Patient Relation
        public int PatientId { get; set; }

        public Patient? Patient { get; set; }


        // Doctor Relation
        public int DoctorId { get; set; }

        public Doctor? Doctor { get; set; }


        [Required]
        public string Diagnosis { get; set; } = string.Empty;


        [Required]
        public string Prescription { get; set; } = string.Empty;


        public string Treatment { get; set; } = string.Empty;


        public string? Notes { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}