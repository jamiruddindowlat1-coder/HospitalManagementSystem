using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TestCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TestCategoriesController> _logger;

        public TestCategoriesController(ApplicationDbContext context, ILogger<TestCategoriesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/testcategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestCategoryDto>>> GetAll()
        {
            var categories = await _context.TestCategories
                .OrderBy(c => c.Name)
                .Select(c => new TestCategoryDto
                {
                    TestCategoryId = c.TestCategoryId,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/testcategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TestCategoryDto>> GetById(int id)
        {
            var category = await _context.TestCategories.FindAsync(id);

            if (category == null)
                return NotFound();

            return Ok(new TestCategoryDto
            {
                TestCategoryId = category.TestCategoryId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            });
        }

        // POST: api/testcategories
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TestCategoryDto>> Create(CreateTestCategoryDto dto)
        {
            var category = new TestCategory
            {
                Name = dto.Name,
                Description = dto.Description,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.TestCategories.Add(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Test category '{Name}' created with ID {Id}", category.Name, category.TestCategoryId);

            return CreatedAtAction(nameof(GetById), new { id = category.TestCategoryId }, new TestCategoryDto
            {
                TestCategoryId = category.TestCategoryId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt
            });
        }

        // PUT: api/testcategories/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, UpdateTestCategoryDto dto)
        {
            var category = await _context.TestCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Test category '{Name}' (ID {Id}) updated", category.Name, category.TestCategoryId);

            return NoContent();
        }

        // DELETE: api/testcategories/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.TestCategories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.TestCategories.Remove(category);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Test category '{Name}' (ID {Id}) deleted", category.Name, id);

            return Ok(new { message = "Test category deleted successfully." });
        }
    }
}