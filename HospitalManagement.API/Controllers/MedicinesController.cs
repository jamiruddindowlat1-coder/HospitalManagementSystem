using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicinesController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/Medicines
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


        // GET: api/Medicines/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MedicineDto>> GetMedicine(int id)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.MedicineId == id);

            if (medicine == null)
            {
                return NotFound(new
                {
                    message = "Medicine not found."
                });
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


        // POST: api/Medicines
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


            return CreatedAtAction(
                nameof(GetMedicine),
                new { id = medicine.MedicineId },
                medicine);
        }



        // PUT: api/Medicines/5
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
                return NotFound(new
                {
                    message = "Medicine not found."
                });
            }


            medicine.MedicineName = dto.MedicineName;
            medicine.Manufacturer = dto.Manufacturer;
            medicine.UnitPrice = dto.UnitPrice;
            medicine.StockQuantity = dto.StockQuantity;
            medicine.ExpiryDate = dto.ExpiryDate;
            medicine.Category = dto.Category;
            medicine.BatchNumber = dto.BatchNumber;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Medicine updated successfully."
            });
        }



        // DELETE: api/Medicines/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.Medicines
                .FirstOrDefaultAsync(m => m.MedicineId == id);


            if (medicine == null)
            {
                return NotFound(new
                {
                    message = "Medicine not found."
                });
            }


            _context.Medicines.Remove(medicine);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Medicine deleted successfully."
            });
        }
    }
}
