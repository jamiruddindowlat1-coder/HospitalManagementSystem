namespace HospitalManagement.API.Models
{
    public class MedicalRecord
    {
        public int RecordId { get; set; }
        public int AppointmentId { get; set; }
        public string? Diagnosis { get; set; }
        public string? Prescription { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Appointment? Appointment { get; set; }
    }
}