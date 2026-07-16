using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UsersController(ApplicationDbContext context) => _context = context;

        private static UserResponseDto ToDto(User u) => new UserResponseDto
        {
            UserId = u.UserId,
            FullName = u.FullName,
            Email = u.Email,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            RoleId = u.Role?.RoleId,
            RoleName = u.Role?.RoleName ?? string.Empty
        };

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return users.Select(ToDto).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound();
            return ToDto(user);
        }

        [HttpGet("roles")]
        public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
        {
            return await _context.Roles
                .Select(r => new RoleResponseDto { RoleId = r.RoleId, RoleName = r.RoleName })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "এই Email দিয়ে ইতিমধ্যে একটা User account আছে।" });

            var role = await _context.Roles.FindAsync(dto.RoleId);
            if (role == null)
                return BadRequest(new { message = "অবৈধ Role নির্বাচন করা হয়েছে।" });

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                IsActive = dto.IsActive,
                CreatedAt = DateTime.Now,
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, ToDto(user));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound();

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.UserId != id))
                return BadRequest(new { message = "এই Email দিয়ে ইতিমধ্যে অন্য একটা User account আছে।" });

            var role = await _context.Roles.FindAsync(dto.RoleId);
            if (role == null)
                return BadRequest(new { message = "অবৈধ Role নির্বাচন করা হয়েছে।" });

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.IsActive = dto.IsActive;
            user.Role = role;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            try
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "এই User-এর সাথে অন্য কোনো record যুক্ত থাকায় delete করা সম্ভব হয়নি।" });
            }
        }
    }
}