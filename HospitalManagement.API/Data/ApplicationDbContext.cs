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


        // Patients & Clinical
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }



        // Hospital
        public DbSet<Department> Departments { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Bed> Beds { get; set; }
        public DbSet<Admission> Admissions { get; set; }



        // Pharmacy
        public DbSet<Medicine> Medicines { get; set; }



        // Laboratory
        public DbSet<LabTest> LabTests { get; set; }
        public DbSet<LabResult> LabResults { get; set; }
        public DbSet<TestCategory> TestCategories { get; set; }
        public DbSet<RadiologyTest> RadiologyTests { get; set; }



        // Nursing
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<NurseAssignment> NurseAssignments { get; set; }
        public DbSet<NursingNote> NursingNotes { get; set; }



        // Accounts
        public DbSet<Billing> Billings { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<SalaryPayment> SalaryPayments { get; set; }
        public DbSet<LedgerEntry> LedgerEntries { get; set; }



        // HR
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<LeaveBalance> LeaveBalances { get; set; }



        // Inventory
        public DbSet<InventoryItem> InventoryItems { get; set; }



        // Security
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }



        // Logs
        public DbSet<ActivityLog> ActivityLogs { get; set; }


    }
}