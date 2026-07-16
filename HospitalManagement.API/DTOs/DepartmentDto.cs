namespace HospitalManagement.API.DTOs
{
    public class DepartmentDto
    {
        public int DepartmentId { get; set; }

        public string DepartmentName { get; set; } = "";

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}