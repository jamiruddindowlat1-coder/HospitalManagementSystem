namespace HospitalManagement.API.DTOs
{
    public class RadiologyTestCreateDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public string TestType { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; } = DateTime.Now;
        public DateTime? ReportDate { get; set; }
        public string Findings { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string ImageUrl { get; set; } = string.Empty;
    }
}
