using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class NurseAssignment
    {
        [Key]
        public int NurseAssignmentId { get; set; }

        [Required]
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        [Required]
        public int NurseId { get; set; }
        public Nurse? Nurse { get; set; }

        [Required]
        public DateTime AssignedDate { get; set; } = DateTime.Now;

        public DateTime? ReleaseDate { get; set; }
    }
}
