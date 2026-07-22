namespace HospitalManagement.API.DTOs
{
    public class LeaveBalanceDto
    {
        public int LeaveBalanceId { get; set; }

        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; } = "";

        public int CasualLeave { get; set; }

        public int SickLeave { get; set; }

        public int EarnedLeave { get; set; }

        public int Year { get; set; }
    }
}