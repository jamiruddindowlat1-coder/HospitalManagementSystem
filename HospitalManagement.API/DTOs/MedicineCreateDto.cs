using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.DTOs
{
    public class MedicineCreateDto
    {
        [Required]
        public string MedicineName { get; set; } = string.Empty;

        public string? Manufacturer { get; set; }

        public decimal UnitPrice { get; set; }

        public int StockQuantity { get; set; }

        public DateTime ExpiryDate { get; set; }

        public string? Category { get; set; }

        public string? BatchNumber { get; set; }
    }
}