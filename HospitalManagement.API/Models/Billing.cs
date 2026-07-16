using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.API.Models
{
    public class Billing
    {
        [Key]
        public int BillId { get; set; }


        public int PatientId { get; set; }


        public int DoctorId { get; set; }


        public decimal ConsultationFee { get; set; }


        public decimal RoomCharge { get; set; }


        public decimal MedicineCharge { get; set; }


        public decimal OtherCharges { get; set; }


        public decimal TotalAmount { get; set; }


        // Required by BillingController
        public string PaymentStatus { get; set; } = "Pending";


        // Required by Dashboard & Reports
        public DateTime BillDate { get; set; } = DateTime.Now;


        public DateTime CreatedAt { get; set; } = DateTime.Now;



        // Navigation

        public Patient? Patient { get; set; }

        public Doctor? Doctor { get; set; }
    }
}