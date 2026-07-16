
using System.Security.Claims;
using Microsoft.AspNetCore.Http;using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Controllers;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using FluentAssertions;

namespace HospitalManagement.Tests;

public class PatientsControllerTests
{
    private ApplicationDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    private PatientsController GetController(ApplicationDbContext context)
    {
        var mockActivityLog = new Mock<IActivityLogService>();
        mockActivityLog
            .Setup(x => x.LogAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int?>()))
            .Returns(Task.CompletedTask);

        var controller = new PatientsController(context, mockActivityLog.Object);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Name, "admin@hospital.local"),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        return controller;
    }

    [Fact]
    public async Task GetPatients_ReturnsAllPatients()
    {
        var context = GetInMemoryContext();
        context.Patients.Add(new Patient { FullName = "Test Patient 1", Gender = "Male" });
        context.Patients.Add(new Patient { FullName = "Test Patient 2", Gender = "Female" });
        await context.SaveChangesAsync();

        var controller = GetController(context);

        var result = await controller.GetPatients();

        result.Value.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreatePatient_AddsPatientSuccessfully()
    {
        var context = GetInMemoryContext();
        var controller = GetController(context);

        var newPatient = new Patient { FullName = "New Patient", Gender = "Male" };

        var result = await controller.CreatePatient(newPatient);

        var created = result.Result as CreatedAtActionResult;
        created.Should().NotBeNull();
        (await context.Patients.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task DeletePatient_WithAppointment_ReturnsBadRequest()
    {
        var context = GetInMemoryContext();
        var patient = new Patient { FullName = "Patient With Appointment", Gender = "Male" };
        context.Patients.Add(patient);
        await context.SaveChangesAsync();

        context.Appointments.Add(new Appointment
        {
            PatientId = patient.PatientId,
            DoctorId = 1,
            AppointmentDate = DateTime.Today,
            AppointmentTime = TimeSpan.FromHours(10),
            Status = "Scheduled"
        });
        await context.SaveChangesAsync();

        var controller = GetController(context);

        var result = await controller.DeletePatient(patient.PatientId);

        result.Should().BeOfType<BadRequestObjectResult>();
        (await context.Patients.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task DeletePatient_WithNoRelatedRecords_DeletesSuccessfully()
    {
        var context = GetInMemoryContext();
        var patient = new Patient { FullName = "Clean Patient", Gender = "Female" };
        context.Patients.Add(patient);
        await context.SaveChangesAsync();

        var controller = GetController(context);

        var result = await controller.DeletePatient(patient.PatientId);

        result.Should().BeOfType<NoContentResult>();
        (await context.Patients.CountAsync()).Should().Be(0);
    }
}