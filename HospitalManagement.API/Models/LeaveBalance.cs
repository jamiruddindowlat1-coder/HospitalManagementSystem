using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class LeaveBalance
    {
        [Key]
        public int LeaveBalanceId { get; set; }

        public int EmployeeId { get; set; }

        public int CasualLeave { get; set; }

        public int SickLeave { get; set; }

        public int EarnedLeave { get; set; }

        public int Year { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Employee? Employee { get; set; }
    }
}