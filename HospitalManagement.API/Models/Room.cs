namespace HospitalManagement.API.Models
{
    public class Room
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
        public decimal PricePerDay { get; set; }
        
        public string Floor { get; set; } = string.Empty;
        public string Status { get; set; } = "Available"; // Available, Occupied, Cleaning, Reserved
        
        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }

        public List<Admission>? Admissions { get; set; }
        public List<Bed>? Beds { get; set; }
    }
}