using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Doctor,Nurse,Receptionist,Patient")]
    public class BedsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BedsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBeds()
        {
            return await _context.Beds
                .Include(b => b.Room)
                .Select(b => new {
                    bedId = b.BedId,
                    roomId = b.RoomId,
                    roomNumber = b.Room != null ? b.Room.RoomNumber : string.Empty,
                    bedNumber = b.BedNumber,
                    occupied = b.Occupied,
                    cleaningStatus = b.CleaningStatus,
                    status = b.Status
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBed(int id)
        {
            var bed = await _context.Beds
                .Include(b => b.Room)
                .Where(b => b.BedId == id)
                .Select(b => new {
                    bedId = b.BedId,
                    roomId = b.RoomId,
                    roomNumber = b.Room != null ? b.Room.RoomNumber : string.Empty,
                    bedNumber = b.BedNumber,
                    occupied = b.Occupied,
                    cleaningStatus = b.CleaningStatus,
                    status = b.Status
                })
                .FirstOrDefaultAsync();

            if (bed == null) return NotFound();
            return bed;
        }

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPost]
        public async Task<ActionResult<Bed>> CreateBed(Bed bed)
        {
            bed.BedId = 0;
            _context.Beds.Add(bed);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBed), new { id = bed.BedId }, bed);
        }

        [Authorize(Roles = "Admin,Receptionist")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBed(int id, Bed bed)
        {
            if (id != bed.BedId) return BadRequest();

            var existing = await _context.Beds.FindAsync(id);
            if (existing == null) return NotFound();

            existing.RoomId = bed.RoomId;
            existing.BedNumber = bed.BedNumber;
            existing.Occupied = bed.Occupied;
            existing.CleaningStatus = bed.CleaningStatus;
            existing.Status = bed.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBed(int id)
        {
            var bed = await _context.Beds.FindAsync(id);
            if (bed == null) return NotFound();

            _context.Beds.Remove(bed);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
