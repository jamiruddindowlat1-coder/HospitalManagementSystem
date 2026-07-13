using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;

namespace HospitalManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;

        public MedicinesController(ApplicationDbContext context, IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicineDto>>> GetMedicines()
        {
            var medicines = await _context.Medicines
                .Select(m => new MedicineDto
                {
                    MedicineId = m.MedicineId,
                    MedicineName = m.MedicineName,
                    Manufacturer = m.Manufacturer,
                    UnitPrice = m.UnitPrice,
                    StockQuantity = m.StockQuantity,
                    ExpiryDate = m.ExpiryDate,
                    Category = m.Category,
                    BatchNumber = m.BatchNumber,
                    CreatedDate = m.CreatedDate
                })
                .ToListAsync();

            return Ok(medicines);
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<MedicineDto>> GetMedicine(int id)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.MedicineId == id);

            if (medicine == null)
            {
                return NotFound(new { message = "Medicine not found." });
            }

            return Ok(new MedicineDto
            {
                MedicineId = medicine.MedicineId,
                MedicineName = medicine.MedicineName,
                Manufacturer = medicine.Manufacturer,
                UnitPrice = medicine.UnitPrice,
                StockQuantity = medicine.StockQuantity,
                ExpiryDate = medicine.ExpiryDate,
                Category = medicine.Category,
                BatchNumber = medicine.BatchNumber,
                CreatedDate = medicine.CreatedDate
            });
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<MedicineDto>> CreateMedicine(
            [FromBody] MedicineCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var medicine = new Medicine
            {
                MedicineName = dto.MedicineName,
                Manufacturer = dto.Manufacturer,
                UnitPrice = dto.UnitPrice,
                StockQuantity = dto.StockQuantity,
                ExpiryDate = dto.ExpiryDate,
                Category = dto.Category,
                BatchNumber = dto.BatchNumber,
                CreatedDate = DateTime.UtcNow
            };

            _context.Medicines.Add(medicine);

            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Created", "Medicine",
                $"Medicine {medicine.MedicineName} added (Stock: {medicine.StockQuantity})", User.GetUserId());

            return CreatedAtAction(
                nameof(GetMedicine),
                new { id = medicine.MedicineId },
                medicine);
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMedicine(
            int id,
            [FromBody] MedicineCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.MedicineId == id);

            if (medicine == null)
            {
                return NotFound(new { message = "Medicine not found." });
            }

            var oldStock = medicine.StockQuantity;

            medicine.MedicineName = dto.MedicineName;
            medicine.Manufacturer = dto.Manufacturer;
            medicine.UnitPrice = dto.UnitPrice;
            medicine.StockQuantity = dto.StockQuantity;
            medicine.ExpiryDate = dto.ExpiryDate;
            medicine.Category = dto.Category;
            medicine.BatchNumber = dto.BatchNumber;

            await _context.SaveChangesAsync();

            if (oldStock != medicine.StockQuantity)
            {
                await _activityLog.LogAsync("Updated", "Medicine",
                    $"{medicine.MedicineName} stock changed from {oldStock} to {medicine.StockQuantity}", User.GetUserId());
            }
            else
            {
                await _activityLog.LogAsync("Updated", "Medicine",
                    $"Medicine {medicine.MedicineName} updated", User.GetUserId());
            }

            return Ok(new { message = "Medicine updated successfully." });
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.MedicineId == id);

            if (medicine == null)
            {
                return NotFound(new { message = "Medicine not found." });
            }

            _context.Medicines.Remove(medicine);

            await _context.SaveChangesAsync();

            await _activityLog.LogAsync("Deleted", "Medicine",
                $"Medicine {medicine.MedicineName} deleted", User.GetUserId());

            return Ok(new { message = "Medicine deleted successfully." });
        }
    }
}