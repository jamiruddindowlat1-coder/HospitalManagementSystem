using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Doctor,Nurse,Receptionist,Patient")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public RoomsController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRooms() =>
            await _context.Rooms
                .Include(r => r.Department)
                .Select(r => new {
                    roomId = r.RoomId,
                    roomNumber = r.RoomNumber,
                    roomType = r.RoomType,
                    isOccupied = r.IsOccupied,
                    pricePerDay = r.PricePerDay,
                    floor = r.Floor,
                    status = r.Status,
                    departmentId = r.DepartmentId,
                    departmentName = r.Department != null ? r.Department.DepartmentName : string.Empty
                })
                .ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.Department)
                .Where(r => r.RoomId == id)
                .Select(r => new {
                    roomId = r.RoomId,
                    roomNumber = r.RoomNumber,
                    roomType = r.RoomType,
                    isOccupied = r.IsOccupied,
                    pricePerDay = r.PricePerDay,
                    floor = r.Floor,
                    status = r.Status,
                    departmentId = r.DepartmentId,
                    departmentName = r.Department != null ? r.Department.DepartmentName : string.Empty
                })
                .FirstOrDefaultAsync();

            if (room == null) return NotFound();
            return room;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom(Room room)
        {
            room.RoomId = 0;
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRoom), new { id = room.RoomId }, room);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, Room room)
        {
            if (id != room.RoomId) return BadRequest();
            
            var existing = await _context.Rooms.FindAsync(id);
            if (existing == null) return NotFound();
            
            existing.RoomNumber = room.RoomNumber;
            existing.RoomType = room.RoomType;
            existing.IsOccupied = room.IsOccupied;
            existing.PricePerDay = room.PricePerDay;
            existing.Floor = room.Floor;
            existing.Status = room.Status;
            existing.DepartmentId = room.DepartmentId;
            
            await _context.SaveChangesAsync();
            return NoContent();
        }

       [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            bool hasAdmissions = await _context.Admissions.AnyAsync(a => a.RoomId == id);
            if (hasAdmissions)
            {
                return BadRequest(new { message = "এই রুমে ভর্তি (Admission) রেকর্ড যুক্ত আছে, তাই এটি ডিলিট করা যাবে না। প্রথমে সংশ্লিষ্ট Admission রেকর্ডগুলো সরান বা রুমের Status পরিবর্তন করুন।" });
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
