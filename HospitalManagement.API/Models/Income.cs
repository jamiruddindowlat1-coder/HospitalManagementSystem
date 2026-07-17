using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class Income
    {
        [Key]
        public int IncomeId { get; set; }

        public string Source { get; set; } = string.Empty; // e.g. "Billing", "Donation", "Other"

        public string Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime IncomeDate { get; set; } = DateTime.Now;

        public string? ReferenceNumber { get; set; } // e.g. related BillId or Receipt No

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}