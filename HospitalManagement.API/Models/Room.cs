namespace HospitalManagement.API.Models
{
    public class Room
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
        public decimal PricePerDay { get; set; }

        public List<Admission>? Admissions { get; set; }
    }
}