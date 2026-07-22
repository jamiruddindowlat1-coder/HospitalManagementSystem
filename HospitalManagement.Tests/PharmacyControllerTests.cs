using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Controllers;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using FluentAssertions;
using Xunit;

namespace HospitalManagement.Tests;

public class PharmacyControllerTests
{
    private ApplicationDbContext GetInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task DispenseMedicine_ValidRequest_DeductsStockAndCreatesBill()
    {
        var context = GetInMemoryContext();
        
        var patient = new Patient { PatientId = 1, FullName = "John Doe", Gender = "Male" };
        var medicine = new Medicine 
        { 
            MedicineId = 1, 
            MedicineName = "Paracetamol", 
            UnitPrice = 10, 
            StockQuantity = 100 
        };
        
        context.Patients.Add(patient);
        context.Medicines.Add(medicine);
        await context.SaveChangesAsync();

        var controller = new PharmacyController(context);

        var request = new DispenseRequest
        {
            PatientId = 1,
            MedicineId = 1,
            Quantity = 5
        };

        var result = await controller.DispenseMedicine(request);

        // Assert
        var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
        var med = await context.Medicines.FindAsync(1);
        med.StockQuantity.Should().Be(95); // 100 - 5

        var bill = await context.Billings.FirstOrDefaultAsync(b => b.PatientId == 1);
        bill.Should().NotBeNull();
        bill.MedicineCharge.Should().Be(50); // 10 * 5
    }

    [Fact]
    public async Task DispenseMedicine_InsufficientStock_ReturnsBadRequest()
    {
        var context = GetInMemoryContext();
        
        var patient = new Patient { PatientId = 1, FullName = "John Doe", Gender = "Male" };
        var medicine = new Medicine 
        { 
            MedicineId = 1, 
            MedicineName = "Paracetamol", 
            UnitPrice = 10, 
            StockQuantity = 3 
        };
        
        context.Patients.Add(patient);
        context.Medicines.Add(medicine);
        await context.SaveChangesAsync();

        var controller = new PharmacyController(context);

        var request = new DispenseRequest
        {
            PatientId = 1,
            MedicineId = 1,
            Quantity = 5
        };

        var result = await controller.DispenseMedicine(request);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var med = await context.Medicines.FindAsync(1);
        med.StockQuantity.Should().Be(3); // Unchanged
    }
}
