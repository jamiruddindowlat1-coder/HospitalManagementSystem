using HospitalManagement.API.Helpers;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {

            context.Database.EnsureCreated();


            // =====================
            // ROLES
            // =====================

            string[] roles =
            {
                "Admin",
                "Doctor",
                "Receptionist",
                "Nurse"
            };


            foreach(var role in roles)
            {
                if(!context.Roles.Any(x=>x.RoleName==role))
                {
                    context.Roles.Add(new Role
                    {
                        RoleName = role
                    });
                }
            }

            context.SaveChanges();



            var adminRole = context.Roles
                .First(x=>x.RoleName=="Admin");


            var doctorRole = context.Roles
                .First(x=>x.RoleName=="Doctor");


            var receptionistRole = context.Roles
                .First(x=>x.RoleName=="Receptionist");



            // =====================
            // USERS
            // =====================


            if(!context.Users.Any(x=>x.Email=="admin@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName="System Administrator",
                    Email="admin@hospital.local",
                    PasswordHash=
                    PasswordHasher.HashPassword("Admin123!"),
                    RoleId=adminRole.RoleId,
                    IsActive=true,
                    CreatedAt=DateTime.Now
                });
            }



            if(!context.Users.Any(x=>x.Email=="sarah.khan@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName="Dr Sarah Khan",
                    Email="sarah.khan@hospital.local",
                    PasswordHash=
                    PasswordHasher.HashPassword("Doctor123!"),
                    RoleId=doctorRole.RoleId,
                    IsActive=true,
                    CreatedAt=DateTime.Now
                });
            }



            if(!context.Users.Any(x=>x.Email=="reception@hospital.local"))
            {
                context.Users.Add(new User
                {
                    FullName="Reception Desk",
                    Email="reception@hospital.local",
                    PasswordHash=
                    PasswordHasher.HashPassword("Reception123!"),
                    RoleId=receptionistRole.RoleId,
                    IsActive=true,
                    CreatedAt=DateTime.Now
                });
            }


            context.SaveChanges();



            // =====================
            // DEPARTMENTS
            // =====================


            string[,] departments =
            {
                {"Cardiology","Heart related treatment"},
                {"Neurology","Brain and nervous system"},
                {"Orthopedics","Bone and joint treatment"},
                {"General Medicine","General health checkup and treatment"},
                {"Pediatrics","Child healthcare"},
                {"Medicine","All Medicine Related Treatment"}
            };



            for(int i=0;i<departments.GetLength(0);i++)
            {

                string name = departments[i,0];


                if(!context.Departments.Any(
                    d=>d.DepartmentName==name))
                {

                    context.Departments.Add(new Department
                    {
                        DepartmentName=name,
                        Description=departments[i,1],
                        CreatedAt=DateTime.Now
                    });

                }

            }


            context.SaveChanges();



            var cardiology =
                context.Departments
                .First(d=>d.DepartmentName=="Cardiology");


            var pediatrics =
                context.Departments
                .First(d=>d.DepartmentName=="Pediatrics");



            // =====================
            // DOCTORS
            // =====================


            if(!context.Doctors.Any(
                d=>d.Email=="sarah.khan@hospital.local"))
            {

                context.Doctors.Add(new Doctor
                {
                    FullName="Dr.Sarah Khan",
                    Specialization="Cardiologist",
                    DepartmentId=cardiology.DepartmentId,
                    PhoneNumber="01712345678",
                    Email="sarah.khan@hospital.local",
                    Qualification="MBBS, MD Cardiology",
                    ExperienceYears=12,
                    ConsultationFee=2500,
                    IsAvailable=true,
                    CreatedAt=DateTime.Now
                });

            }



            if(!context.Doctors.Any(
                d=>d.Email=="arif.hasan@hospital.local"))
            {

                context.Doctors.Add(new Doctor
                {
                    FullName="Dr.Arif Hasan",
                    Specialization="Pediatrician",
                    DepartmentId=pediatrics.DepartmentId,
                    PhoneNumber="01712345679",
                    Email="arif.hasan@hospital.local",
                    Qualification="MBBS,DCH",
                    ExperienceYears=9,
                    ConsultationFee=1800,
                    IsAvailable=true,
                    CreatedAt=DateTime.Now
                });

            }



            context.SaveChanges();



            // =====================
            // MEDICINE
            // =====================


            if(!context.Medicines.Any())
            {

                context.Medicines.Add(new Medicine
                {
                    MedicineName="Paracetamol",
                    Manufacturer="Healthcare Pharma",
                    UnitPrice=20,
                    StockQuantity=500,
                    ExpiryDate=DateTime.Now.AddYears(1)
                });


                context.SaveChanges();

            }


        }
    }
}