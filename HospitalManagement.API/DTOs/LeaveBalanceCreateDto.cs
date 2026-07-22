namespace HospitalManagement.API.DTOs
{
    public class LeaveBalanceCreateDto
    {
        public int EmployeeId { get; set; }

        public int CasualLeave { get; set; }

        public int SickLeave { get; set; }

        public int EarnedLeave { get; set; }

        public int Year { get; set; }
    }
}