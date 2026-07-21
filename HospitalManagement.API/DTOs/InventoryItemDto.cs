namespace HospitalManagement.API.DTOs
{
    public class InventoryItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public int QuantityInStock { get; set; }
        public int MinimumStockLevel { get; set; } = 10;
        public decimal UnitPrice { get; set; }
        public string Supplier { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = "In Stock";
    }
}
