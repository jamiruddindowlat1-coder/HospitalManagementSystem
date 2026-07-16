using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabTestController : ControllerBase
    {
        private readonly LabTestService _labTestService;

        public LabTestController(LabTestService labTestService)
        {
            _labTestService = labTestService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _labTestService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _labTestService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LabTestCreateDto dto)
        {
            var result = await _labTestService.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LabTestCreateDto dto)
        {
            var success = await _labTestService.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _labTestService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}