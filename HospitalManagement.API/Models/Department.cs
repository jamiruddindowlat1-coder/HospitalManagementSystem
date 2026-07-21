namespace HospitalManagement.API.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string Location { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; // Active / Inactive
        public string? DepartmentHead { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;


        // Navigation
        public ICollection<Doctor>? Doctors { get; set; }
    }
}