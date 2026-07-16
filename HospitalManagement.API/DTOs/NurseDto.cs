using System.ComponentModel.DataAnnotations;
namespace HospitalManagement.API.DTOs
{
    public class NurseDto
    {
        public int NurseId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Shift { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public bool IsActive { get; set; }
    }

    public class NurseCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Shift { get; set; } = string.Empty;

        [Required]
        public int DepartmentId { get; set; }
    }
}