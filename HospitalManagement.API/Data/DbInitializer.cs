using HospitalManagement.API.Helpers;
using HospitalManagement.API.Models;
using Microsoft.EntityFrameworkCore;
namespace HospitalManagement.API.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {
            var requiredRoleNames = new[] { "Admin", "Doctor", "Receptionist", "Nurse" };
            var existingRoles = context.Roles
                .Where(r => requiredRoleNames.Contains(r.RoleName))
                .ToList();

            var missingRoleNames = requiredRoleNames.Except(existingRoles.Select(r => r.RoleName)).ToList();
            if (missingRoleNames.Any())
            {
                context.Roles.AddRange(missingRoleNames.Select(roleName => new Role { RoleName = roleName }));
                context.SaveChanges();
                existingRoles = context.Roles
                    .Where(r => requiredRoleNames.Contains(r.RoleName))
                    .ToList();
            }

            var adminRole = existingRoles.Single(r => r.RoleName == "Admin");
            var doctorRole = existingRoles.Single(r => r.RoleName == "Doctor");
            var receptionistRole = existingRoles.Single(r => r.RoleName == "Receptionist");

            if (!context.Users.Any(u => u.Email == "admin@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName = "System Administrator",
                    Email = "admin@hospital.local",
                    PasswordHash = PasswordHasher.HashPassword("Admin123!"),
                    RoleId = adminRole.RoleId,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                });
            }

            if (!context.Users.Any(u => u.Email == "sarah.khan@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName = "Dr. Sarah Khan",
                    Email = "sarah.khan@hospital.local",
                    PasswordHash = PasswordHasher.HashPassword("Doctor123!"),
                    RoleId = doctorRole.RoleId,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                });
            }

            if (!context.Users.Any(u => u.Email == "reception@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName = "Reception Desk",
                    Email = "reception@hospital.local",
                    PasswordHash = PasswordHasher.HashPassword("Reception123!"),
                    RoleId = receptionistRole.RoleId,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                });
            }

            context.SaveChanges();

            if (!context.Departments.Any())
            {
                context.Departments.AddRange(
                    new Department { DepartmentName = "Cardiology", Description = "Cardiac care and diagnostics." },
                    new Department { DepartmentName = "Neurology", Description = "Brain and nervous system treatment." },
                    new Department { DepartmentName = "Pediatrics", Description = "Child healthcare services." });
                context.SaveChanges();
            }

            var cardiologyDept = context.Departments.First(d => d.DepartmentName == "Cardiology");
            var pediatricsDept = context.Departments.First(d => d.DepartmentName == "Pediatrics");

            var doctor1 = context.Doctors.FirstOrDefault(d => d.Email == "sarah.khan@hospital.local");
            if (doctor1 == null)
            {
                doctor1 = new Doctor
                {
                    FullName = "Sarah Khan",
                    Specialization = "Cardiologist",
                    DepartmentId = cardiologyDept.DepartmentId,
                    PhoneNumber = "+8801712345678",
                    Email = "sarah.khan@hospital.local",
                    Qualification = "MBBS, MD Cardiology",
                    ExperienceYears = 12,
                    ConsultationFee = 2500,
                    IsAvailable = true,
                    CreatedAt = DateTime.Now
                };
                context.Doctors.Add(doctor1);
            }

            var doctor2 = context.Doctors.FirstOrDefault(d => d.Email == "arif.hasan@hospital.local");
            if (doctor2 == null)
            {
                doctor2 = new Doctor
                {
                    FullName = "Arif Hasan",
                    Specialization = "Pediatrician",
                    DepartmentId = pediatricsDept.DepartmentId,
                    PhoneNumber = "+8801712345679",
                    Email = "arif.hasan@hospital.local",
                    Qualification = "MBBS, DCH",
                    ExperienceYears = 9,
                    ConsultationFee = 1800,
                    IsAvailable = true,
                    CreatedAt = DateTime.Now
                };
                context.Doctors.Add(doctor2);
            }

            context.SaveChanges();

            var patient1 = context.Patients.FirstOrDefault(p => p.Email == "nusrat.jahan@example.com");
            if (patient1 == null)
            {
                patient1 = new Patient
                {
                    FullName = "Nusrat Jahan",
                    DateOfBirth = new DateTime(1995, 5, 14),
                    Age = 29,
                    Gender = "Female",
                    BloodGroup = "A+",
                    ContactNumber = "+8801812345678",
                    Email = "nusrat.jahan@example.com",
                    Address = "House 12, Road 5, Dhaka",
                    EmergencyContactName = "Md. Hasan",
                    EmergencyContactNumber = "+8801711122233",
                    MedicalHistory = "Hypertension",
                    RegisteredAt = DateTime.Now
                };
                context.Patients.Add(patient1);
            }

            var patient2 = context.Patients.FirstOrDefault(p => p.Email == "rafiq.ahmed@example.com");
            if (patient2 == null)
            {
                patient2 = new Patient
                {
                    FullName = "Rafiq Ahmed",
                    DateOfBirth = new DateTime(1983, 11, 22),
                    Age = 41,
                    Gender = "Male",
                    BloodGroup = "B+",
                    ContactNumber = "+8801912345678",
                    Email = "rafiq.ahmed@example.com",
                    Address = "Road 10, Chittagong",
                    EmergencyContactName = "Shahida Begum",
                    EmergencyContactNumber = "+8801713344556",
                    MedicalHistory = "Diabetes",
                    RegisteredAt = DateTime.Now
                };
                context.Patients.Add(patient2);
            }

            context.SaveChanges();

            // FIX: check each room individually instead of "!context.Rooms.Any()",
            // so seeding still works even if the Rooms table already has other rows.
            if (!context.Rooms.Any(r => r.RoomNumber == "101A"))
            {
                context.Rooms.Add(new Room { RoomNumber = "101A", RoomType = "Private", IsOccupied = false, PricePerDay = 3500 });
            }
            if (!context.Rooms.Any(r => r.RoomNumber == "201B"))
            {
                context.Rooms.Add(new Room { RoomNumber = "201B", RoomType = "General", IsOccupied = false, PricePerDay = 2000 });
            }
            context.SaveChanges();

            var appointment1 = context.Appointments.FirstOrDefault(a => a.Reason == "Chest pain and shortness of breath");
            if (appointment1 == null)
            {
                appointment1 = new Appointment
                {
                    PatientId = context.Patients.First(p => p.Email == "nusrat.jahan@example.com").PatientId,
                    DoctorId = context.Doctors.First(d => d.Email == "sarah.khan@hospital.local").DoctorId,
                    AppointmentDate = DateTime.Today.AddDays(1),
                    AppointmentTime = new TimeSpan(10, 30, 0),
                    Reason = "Chest pain and shortness of breath",
                    Status = "Scheduled",
                    CreatedAt = DateTime.Now
                };
                context.Appointments.Add(appointment1);
            }

            var appointment2 = context.Appointments.FirstOrDefault(a => a.Reason == "Routine child health check");
            if (appointment2 == null)
            {
                appointment2 = new Appointment
                {
                    PatientId = context.Patients.First(p => p.Email == "rafiq.ahmed@example.com").PatientId,
                    DoctorId = context.Doctors.First(d => d.Email == "arif.hasan@hospital.local").DoctorId,
                    AppointmentDate = DateTime.Today.AddDays(2),
                    AppointmentTime = new TimeSpan(11, 0, 0),
                    Reason = "Routine child health check",
                    Status = "Scheduled",
                    CreatedAt = DateTime.Now
                };
                context.Appointments.Add(appointment2);
            }

            context.SaveChanges();

            if (!context.MedicalRecords.Any(m => m.AppointmentId == appointment1.AppointmentId))
            {
                context.MedicalRecords.Add(new MedicalRecord
                {
                    AppointmentId = appointment1.AppointmentId,
                    Diagnosis = "Stable angina",
                    Prescription = "Aspirin 75mg once daily",
                    Notes = "Follow-up after one week.",
                    CreatedAt = DateTime.Now
                });
                context.SaveChanges();
            }

            var admission1 = context.Admissions
                .Include(a => a.Patient)
                .FirstOrDefault(a => a.Patient.Email == "rafiq.ahmed@example.com");
            if (admission1 == null)
            {
                var patientRafiq = context.Patients.First(p => p.Email == "rafiq.ahmed@example.com");
                admission1 = new Admission
                {
                    PatientId = patientRafiq.PatientId,
                    RoomId = context.Rooms.First(r => r.RoomNumber == "201B").RoomId,
                    DoctorId = context.Doctors.First(d => d.Email == "arif.hasan@hospital.local").DoctorId,
                    AdmissionDate = DateTime.Today.AddDays(-1),
                    DischargeDate = null,
                    Status = "Admitted"
                };
                context.Admissions.Add(admission1);
                context.SaveChanges();
            }

            if (!context.Medicines.Any(m => m.MedicineName == "Paracetamol"))
            {
                context.Medicines.AddRange(
                    new Medicine
                    {
                        MedicineName = "Paracetamol",
                        Manufacturer = "Healthcare Pharma",
                        UnitPrice = 20,
                        StockQuantity = 450,
                        ExpiryDate = DateTime.Today.AddMonths(18)
                    },
                    new Medicine
                    {
                        MedicineName = "Amlodipine",
                        Manufacturer = "GoodHealth Labs",
                        UnitPrice = 45,
                        StockQuantity = 120,
                        ExpiryDate = DateTime.Today.AddMonths(12)
                    });
                context.SaveChanges();
            }

            if (!context.Billings.Any(b => b.Patient.Email == "rafiq.ahmed@example.com"))
            {
                var doctorArif = context.Doctors.First(d => d.Email == "arif.hasan@hospital.local");
                var room201B = context.Rooms.First(r => r.RoomNumber == "201B");
                context.Billings.Add(new Billing
                {
                    PatientId = context.Patients.First(p => p.Email == "rafiq.ahmed@example.com").PatientId,
                    AdmissionId = admission1.AdmissionId,
                    ConsultationFee = doctorArif.ConsultationFee,
                    RoomCharge = room201B.PricePerDay * 2,
                    MedicineCharge = 150,
                    OtherCharges = 100,
                    PaymentStatus = "Unpaid",
                    BillDate = DateTime.Now
                });
                context.SaveChanges();
            }
        }
    }
}