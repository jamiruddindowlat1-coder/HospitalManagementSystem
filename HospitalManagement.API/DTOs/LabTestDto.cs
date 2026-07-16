namespace HospitalManagement.API.DTOs
{
    public class LabTestDto
    {
        public int LabTestId { get; set; }
        public int PatientId { get; set; }
        public string? PatientName { get; set; }
        public int DoctorId { get; set; }
        public string? DoctorName { get; set; }
        public string TestName { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime OrderedDate { get; set; }
        public DateTime? ResultDate { get; set; }
        public string? Result { get; set; }
        public string? Notes { get; set; }
    }

    public class LabTestCreateDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public string TestName { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime? OrderedDate { get; set; }
        public DateTime? ResultDate { get; set; }
        public string? Result { get; set; }
        public string? Notes { get; set; }
    }
}