using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Inventory
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.InventoryItems
                .OrderBy(x => x.ItemName)
                .ToListAsync();

            return Ok(items);
        }

        // GET: api/Inventory/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.InventoryItems.FindAsync(id);

            if (item == null)
                return NotFound(new { message = "Inventory item not found" });

            return Ok(item);
        }

        // GET: api/Inventory/low-stock
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var items = await _context.InventoryItems
                .Where(x => x.QuantityInStock <= x.MinimumStockLevel)
                .OrderBy(x => x.QuantityInStock)
                .ToListAsync();

            return Ok(items);
        }

        // POST: api/Inventory
        [HttpPost]
        public async Task<IActionResult> Create(InventoryItemDto dto)
        {
            // Auto-set status based on stock level
            var status = GetStockStatus(dto.QuantityInStock, dto.MinimumStockLevel);

            var item = new InventoryItem
            {
                ItemName         = dto.ItemName,
                Category         = dto.Category,
                Unit             = dto.Unit,
                QuantityInStock  = dto.QuantityInStock,
                MinimumStockLevel= dto.MinimumStockLevel,
                UnitPrice        = dto.UnitPrice,
                Supplier         = dto.Supplier,
                ExpiryDate       = dto.ExpiryDate,
                Location         = dto.Location,
                Status           = status,
                CreatedAt        = DateTime.Now,
                UpdatedAt        = DateTime.Now
            };

            _context.InventoryItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Inventory item created successfully", data = item });
        }

        // PUT: api/Inventory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InventoryItemDto dto)
        {
            var item = await _context.InventoryItems.FindAsync(id);

            if (item == null)
                return NotFound(new { message = "Inventory item not found" });

            item.ItemName          = dto.ItemName;
            item.Category          = dto.Category;
            item.Unit              = dto.Unit;
            item.QuantityInStock   = dto.QuantityInStock;
            item.MinimumStockLevel = dto.MinimumStockLevel;
            item.UnitPrice         = dto.UnitPrice;
            item.Supplier          = dto.Supplier;
            item.ExpiryDate        = dto.ExpiryDate;
            item.Location          = dto.Location;
            item.Status            = GetStockStatus(dto.QuantityInStock, dto.MinimumStockLevel);
            item.UpdatedAt         = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Inventory item updated successfully" });
        }

        // PATCH: api/Inventory/5/adjust-stock
        [HttpPatch("{id}/adjust-stock")]
        public async Task<IActionResult> AdjustStock(int id, [FromBody] int adjustment)
        {
            var item = await _context.InventoryItems.FindAsync(id);

            if (item == null)
                return NotFound(new { message = "Inventory item not found" });

            item.QuantityInStock += adjustment;
            if (item.QuantityInStock < 0) item.QuantityInStock = 0;

            item.Status    = GetStockStatus(item.QuantityInStock, item.MinimumStockLevel);
            item.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stock adjusted successfully", newQuantity = item.QuantityInStock });
        }

        // DELETE: api/Inventory/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.InventoryItems.FindAsync(id);

            if (item == null)
                return NotFound(new { message = "Inventory item not found" });

            _context.InventoryItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Inventory item deleted successfully" });
        }

        private static string GetStockStatus(int qty, int minLevel)
        {
            if (qty == 0)          return "Out of Stock";
            if (qty <= minLevel)   return "Low Stock";
            return "In Stock";
        }
    }
}
