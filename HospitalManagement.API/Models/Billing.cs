namespace HospitalManagement.API.Models
{
    public class Billing
    {
        public int BillId { get; set; }
        public int PatientId { get; set; }
        public int? AppointmentId { get; set; }
        public int? AdmissionId { get; set; }
        public decimal ConsultationFee { get; set; }
        public decimal RoomCharge { get; set; }
        public decimal MedicineCharge { get; set; }
        public decimal OtherCharges { get; set; }
        public decimal TotalAmount { get; set; } // Computed column in DB
        public string PaymentStatus { get; set; } = "Unpaid";
        public DateTime BillDate { get; set; } = DateTime.Now;

        // Navigation properties
        public Patient? Patient { get; set; }
        public Appointment? Appointment { get; set; }
        public Admission? Admission { get; set; }
    }
}