namespace HospitalManagement.API.DTOs
{
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? NID { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public DateTime JoiningDate { get; set; }
        public decimal Salary { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? UserId { get; set; }
    }

    public class EmployeeCreateDto
    {
        public string FullName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? NID { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactPhone { get; set; }
        public DateTime JoiningDate { get; set; }
        public decimal Salary { get; set; }
        public int? UserId { get; set; }
    }

    public class EmployeeUpdateDto : EmployeeCreateDto
    {
        public string Status { get; set; } = "Active";
    }
}