namespace HospitalManagement.API.Models
{
    public class Admission
    {
        public int AdmissionId { get; set; }
        public int PatientId { get; set; }
        public int RoomId { get; set; }
        public int DoctorId { get; set; }
        public bool IsEmergency { get; set; } = false;
        public DateTime AdmissionDate { get; set; } = DateTime.Now;
        public DateTime? DischargeDate { get; set; }
        public string Status { get; set; } = "Admitted";

        // Navigation properties
        public Patient? Patient { get; set; }
        public Room? Room { get; set; }
        public Doctor? Doctor { get; set; }
        public List<Billing>? Bills { get; set; }
    }
}