namespace HospitalManagement.API.DTOs
{
    public class PayrollCreateDto
    {
        public int EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public decimal HouseRentAllowance { get; set; }
        public decimal MedicalAllowance { get; set; }
        public decimal TransportAllowance { get; set; }
        public decimal OtherAllowance { get; set; }

        public decimal ProvidentFund { get; set; }
        public decimal TaxDeduction { get; set; }
        public decimal AbsenceDeduction { get; set; }
        public decimal OtherDeduction { get; set; }
    }

    public class PayrollDto
    {
        public int PayrollId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;

        public int Month { get; set; }
        public int Year { get; set; }

        public decimal BasicSalary { get; set; }
        public decimal HouseRentAllowance { get; set; }
        public decimal MedicalAllowance { get; set; }
        public decimal TransportAllowance { get; set; }
        public decimal OtherAllowance { get; set; }

        public decimal ProvidentFund { get; set; }
        public decimal TaxDeduction { get; set; }
        public decimal AbsenceDeduction { get; set; }
        public decimal OtherDeduction { get; set; }

        public decimal GrossSalary { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetSalary { get; set; }

        public string Status { get; set; } = string.Empty;
        public DateTime? PaidDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}