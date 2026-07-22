using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class RolePermission
    {
        [Key]
        public int RolePermissionId { get; set; }

        [Required]
        public int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        [Required]
        [MaxLength(50)]
        public string ModuleName { get; set; } = string.Empty;

        public bool HasAccess { get; set; } = false;
    }
}