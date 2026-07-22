namespace HospitalManagement.API.Models
{
    public class Attendance
    {
        public int AttendanceId { get; set; }

        public int EmployeeId { get; set; }

        public Employee? Employee { get; set; }

        public DateTime Date { get; set; }

        public string Status { get; set; } = "Present";

        public string? Remarks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}