namespace HospitalManagement.API.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
       public bool IsActive { get; set; } = true;
       public DateTime CreatedAt { get; set; } = DateTime.Now;
       public string? PasswordResetToken { get; set; }
       public DateTime? PasswordResetTokenExpiry { get; set; }

        // Navigation properties
        public Role? Role { get; set; }
        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
    }
}