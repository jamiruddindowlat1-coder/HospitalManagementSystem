using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class TestCategory
    {
        [Key]
        public int TestCategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}