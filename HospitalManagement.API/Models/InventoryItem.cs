using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class InventoryItem
    {
        [Key]
        public int InventoryItemId { get; set; }

        [Required]
        [MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty; // e.g. Medical Supplies, Equipment, Drugs, PPE

        [MaxLength(50)]
        public string Unit { get; set; } = string.Empty; // pcs, box, kg, litre

        [Required]
        public int QuantityInStock { get; set; } = 0;

        public int MinimumStockLevel { get; set; } = 10; // alert threshold

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; } = 0;

        [MaxLength(150)]
        public string Supplier { get; set; } = string.Empty;

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(50)]
        public string Location { get; set; } = string.Empty; // e.g. Store Room A, Pharmacy

        [MaxLength(50)]
        public string Status { get; set; } = "In Stock"; // In Stock, Low Stock, Out of Stock

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
