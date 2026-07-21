using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RadiologyTestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RadiologyTestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RadiologyTests
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.RadiologyTests
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .ToListAsync();

            return Ok(data);
        }

        // GET: api/RadiologyTests/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.RadiologyTests
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.RadiologyTestId == id);

            if (data == null)
                return NotFound(new { message = "Radiology Test not found" });

            return Ok(data);
        }

        // POST: api/RadiologyTests
        [HttpPost]
        public async Task<IActionResult> Create(RadiologyTestCreateDto dto)
        {
            var test = new RadiologyTest
            {
                PatientId  = dto.PatientId,
                DoctorId   = dto.DoctorId,
                TestType   = dto.TestType,
                RequestDate= dto.RequestDate,
                ReportDate = dto.ReportDate,
                Findings   = dto.Findings,
                Status     = dto.Status,
                ImageUrl   = dto.ImageUrl
            };

            _context.RadiologyTests.Add(test);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Radiology Test Created Successfully", data = test });
        }

        // PUT: api/RadiologyTests/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RadiologyTestCreateDto dto)
        {
            var test = await _context.RadiologyTests.FindAsync(id);

            if (test == null)
                return NotFound(new { message = "Radiology Test not found" });

            test.PatientId  = dto.PatientId;
            test.DoctorId   = dto.DoctorId;
            test.TestType   = dto.TestType;
            test.RequestDate= dto.RequestDate;
            test.ReportDate = dto.ReportDate;
            test.Findings   = dto.Findings;
            test.Status     = dto.Status;
            test.ImageUrl   = dto.ImageUrl;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Radiology Test Updated Successfully" });
        }

        // DELETE: api/RadiologyTests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var test = await _context.RadiologyTests.FindAsync(id);

            if (test == null)
                return NotFound(new { message = "Radiology Test not found" });

            _context.RadiologyTests.Remove(test);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Radiology Test Deleted Successfully" });
        }
    }
}
