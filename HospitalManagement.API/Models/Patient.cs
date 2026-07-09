namespace HospitalManagement.API.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        public int? UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string? BloodGroup { get; set; }
        public string ContactNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactNumber { get; set; }
        public string? MedicalHistory { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.Now;

        // Navigation properties
        public User? User { get; set; }
        public List<Appointment>? Appointments { get; set; }
        public List<Admission>? Admissions { get; set; }
        public List<Billing>? Bills { get; set; }
    }
}