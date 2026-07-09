namespace HospitalManagement.API.DTOs
{
    public class AdmissionCreateDto
    {
        public int PatientId { get; set; }
        public int RoomId { get; set; }
        public int DoctorId { get; set; }

        public DateTime AdmissionDate { get; set; }

        public DateTime? DischargeDate { get; set; }

        public string Status { get; set; } = "Admitted";
    }


    public class AdmissionResponseDto
    {
        public int AdmissionId { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;

        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public DateTime AdmissionDate { get; set; }

        public DateTime? DischargeDate { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}