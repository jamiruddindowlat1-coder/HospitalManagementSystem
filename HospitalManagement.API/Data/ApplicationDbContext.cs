using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }


        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<LabTest> LabTests { get; set; }
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

            // Keys

modelBuilder.Entity<Nurse>()
    .HasOne(n => n.Department)
    .WithMany()
    .HasForeignKey(n => n.DepartmentId)
    .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Billing>()
                .HasKey(x => x.BillId);


            modelBuilder.Entity<MedicalRecord>()
                .HasKey(x => x.RecordId);



            // Department - Doctor Relation (ONLY ONE)

            modelBuilder.Entity<Doctor>()
                .HasOne(d => d.Department)
                .WithMany(d => d.Doctors)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);



            // Billing Computed Column

            modelBuilder.Entity<Billing>()
    .Property(x => x.TotalAmount)  
    .HasPrecision(18, 2)
    .HasComputedColumnSql(
        "[ConsultationFee] + [RoomCharge] + [MedicineCharge] + [OtherCharges]"
    );



            // Billing Decimal

            modelBuilder.Entity<Billing>()
                .Property(x => x.ConsultationFee)
                .HasPrecision(18, 2);


            modelBuilder.Entity<Billing>()
                .Property(x => x.RoomCharge)
                .HasPrecision(18, 2);


            modelBuilder.Entity<Billing>()
                .Property(x => x.MedicineCharge)
                .HasPrecision(18, 2);


            modelBuilder.Entity<Billing>()
                .Property(x => x.OtherCharges)
                .HasPrecision(18, 2);



            // Doctor Decimal

            modelBuilder.Entity<Doctor>()
                .Property(x => x.ConsultationFee)
                .HasPrecision(18, 2);



            // Medicine Decimal

            modelBuilder.Entity<Medicine>()
                .Property(x => x.UnitPrice)
                .HasPrecision(18, 2);



            // Room Decimal

            modelBuilder.Entity<Room>()
                .Property(x => x.PricePerDay)
                .HasPrecision(18, 2);



            modelBuilder.Entity<Billing>()
                .ToTable("Billing");



            base.OnModelCreating(modelBuilder);
        }
    }
}

