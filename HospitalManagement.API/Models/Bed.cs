using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalManagement.API.Models
{
    public class Bed
    {
        [Key]
        public int BedId { get; set; }

        [Required]
        public int RoomId { get; set; }
        public Room? Room { get; set; }

        [Required]
        [MaxLength(50)]
        public string BedNumber { get; set; } = string.Empty;

        public bool Occupied { get; set; }

        [MaxLength(50)]
        public string CleaningStatus { get; set; } = "Clean"; // Clean, Dirty, InProgress

        [MaxLength(50)]
        public string Status { get; set; } = "Available"; // Available, Occupied, Cleaning, Reserved
    }
}
