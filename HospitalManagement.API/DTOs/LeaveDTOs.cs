using System;

namespace HospitalManagement.API.DTOs
{
    public class LeaveCreateDto
    {
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string? Reason { get; set; }
    }

    public class LeaveDto
    {
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? DecisionDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}