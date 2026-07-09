using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class Medicine
    {
        [Key]
        public int MedicineId { get; set; }

        [Required(ErrorMessage = "Medicine name is required")]
        [MaxLength(150)]
        public string MedicineName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Manufacturer { get; set; }

        public decimal UnitPrice { get; set; }

        public int StockQuantity { get; set; }

        public DateTime ExpiryDate { get; set; }

        public string? Category { get; set; }

        public string? BatchNumber { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}