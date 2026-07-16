using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabResultsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabResultsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/LabResults
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.LabResults
                .Include(x => x.Patient)
                .Include(x => x.LabTest)
                .ToListAsync();

            return Ok(data);
        }



        // GET: api/LabResults/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _context.LabResults
                .Include(x => x.Patient)
                .Include(x => x.LabTest)
                .FirstOrDefaultAsync(x => x.LabResultId == id);


            if (data == null)
            {
                return NotFound(new
                {
                    message = "Lab Result not found"
                });
            }


            return Ok(data);
        }



        // POST: api/LabResults
        [HttpPost]
        public async Task<IActionResult> Create(LabResultCreateDto dto)
        {

            var labResult = new LabResult
            {
                PatientId = dto.PatientId,
                LabTestId = dto.LabTestId,
                Result = dto.Result,

                // Remarks থেকে Notes এ save হবে
               Notes = dto.Notes,

                Status = dto.Status,
                CreatedAt = DateTime.Now
            };


            _context.LabResults.Add(labResult);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Lab Result Created Successfully",
                data = labResult
            });
        }




        // PUT: api/LabResults/1
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            LabResultCreateDto dto)
        {

            var labResult = await _context.LabResults
                .FindAsync(id);


            if (labResult == null)
            {
                return NotFound();
            }


            labResult.PatientId = dto.PatientId;

            labResult.LabTestId = dto.LabTestId;

            labResult.Result = dto.Result;

            labResult.Notes = dto.Notes;

            labResult.Status = dto.Status;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Lab Result Updated Successfully"
            });
        }





        // DELETE: api/LabResults/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            var labResult = await _context.LabResults
                .FindAsync(id);


            if (labResult == null)
            {
                return NotFound();
            }


            _context.LabResults.Remove(labResult);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Lab Result Deleted Successfully"
            });
        }

    }
}