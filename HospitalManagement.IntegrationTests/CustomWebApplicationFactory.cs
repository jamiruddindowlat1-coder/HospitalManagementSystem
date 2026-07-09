using HospitalManagement.API.Data;
using HospitalManagement.API.Helpers;
using HospitalManagement.API.Models;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;


namespace HospitalManagement.IntegrationTests;


public class CustomWebApplicationFactory 
    : WebApplicationFactory<Program>
{
public CustomWebApplicationFactory()
{
    Environment.SetEnvironmentVariable("JWT_SECRET_KEY", "TestSecretKeyForIntegrationTests12345!");
}
    protected override void ConfigureWebHost(
        IWebHostBuilder builder)
    {

        builder.UseEnvironment("Testing");


        builder.ConfigureServices(services =>
        {

            // Remove SQL Server DbContext
            services.RemoveAll<
                DbContextOptions<ApplicationDbContext>>();

            services.RemoveAll<ApplicationDbContext>();


            // Add InMemory Database
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseInMemoryDatabase(
                    "Hospital_Test_DB");
            });


        });



        builder.ConfigureServices(services =>
        {

            var provider =
                services.BuildServiceProvider();


            using var scope =
                provider.CreateScope();


            var db =
                scope.ServiceProvider
                .GetRequiredService<ApplicationDbContext>();


            db.Database.EnsureCreated();



            // Add Role
            if(!db.Roles.Any())
            {
                db.Roles.Add(new Role
                {
                    RoleName = "Admin"
                });

                db.SaveChanges();
            }



            // Add Test User
            if(!db.Users.Any())
            {

                var role =
                    db.Roles.First();


                db.Users.Add(new User
                {
                    FullName = "Test Admin",

                    Email = "admin@hospital.local",

                    PasswordHash =
                        PasswordHasher.HashPassword(
                            "Admin123!"),


                    RoleId = role.RoleId,

                    IsActive = true
                });


                db.SaveChanges();

            }

        });

    }

}