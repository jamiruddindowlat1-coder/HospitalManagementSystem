using System;

namespace HospitalManagement.API.DTOs
{
    public class MedicineDto
    {
        public int MedicineId { get; set; }

        public string MedicineName { get; set; } = string.Empty;

        public string? Manufacturer { get; set; }

        public decimal UnitPrice { get; set; }

        public int StockQuantity { get; set; }

        public DateTime ExpiryDate { get; set; }

        public string? Category { get; set; }

        public string? BatchNumber { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}