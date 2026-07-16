using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Receptionist")]
    public class NurseController : ControllerBase
    {
        private readonly NurseService _nurseService;

        public NurseController(NurseService nurseService)
        {
            _nurseService = nurseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var nurses = await _nurseService.GetAllNursesAsync();
            return Ok(nurses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var nurse = await _nurseService.GetNurseByIdAsync(id);
            if (nurse == null) return NotFound();
            return Ok(nurse);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NurseCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var nurse = await _nurseService.CreateNurseAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = nurse.NurseId }, nurse);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NurseCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _nurseService.UpdateNurseAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _nurseService.DeleteNurseAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}