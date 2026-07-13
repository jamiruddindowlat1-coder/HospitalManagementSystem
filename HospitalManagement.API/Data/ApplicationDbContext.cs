using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Admission> Admissions { get; set; }
        public DbSet<Billing> Billings { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map entity to actual SQL table name (table is "Billing", not "Billings")
            modelBuilder.Entity<Billing>().ToTable("Billing");

            // Explicitly set primary keys where property name doesn't match EF Core convention
            modelBuilder.Entity<Billing>()
                .HasKey(b => b.BillId);

            modelBuilder.Entity<MedicalRecord>()
                .HasKey(m => m.RecordId);

            // Billing.TotalAmount is a computed column in SQL, so mark it as such
            modelBuilder.Entity<Billing>()
                .Property(b => b.TotalAmount)
                .HasComputedColumnSql("[ConsultationFee] + [RoomCharge] + [MedicineCharge] + [OtherCharges]");

            base.OnModelCreating(modelBuilder);
        }
    }
}