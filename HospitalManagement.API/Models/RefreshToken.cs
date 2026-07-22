namespace HospitalManagement.API.Models
{
    public class RefreshToken
    {
        public int RefreshTokenId { get; set; }
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRevoked { get; set; } = false;

        // Navigation property
        public User? User { get; set; }
    }
}