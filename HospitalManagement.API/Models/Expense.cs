using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }

        public string Category { get; set; } = string.Empty; // e.g. "Salary", "Utility", "Maintenance", "Medicine Purchase"

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime ExpenseDate { get; set; } = DateTime.Now;

        public string? ReferenceNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}