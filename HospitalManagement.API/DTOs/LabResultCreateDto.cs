namespace HospitalManagement.API.DTOs
{
    public class LabResultCreateDto
    {
        public int PatientId { get; set; }

        public int LabTestId { get; set; }

        public string Result { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public string Status { get; set; } = "Pending";
    }
}