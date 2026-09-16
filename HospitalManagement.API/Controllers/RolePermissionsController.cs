using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using System.Security.Claims;

namespace HospitalManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolePermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private static readonly string[] AllModules =
        {
            "Dashboard",
            "Departments",
            "Patients",
            "Doctors",
            "Appointments",
            "Admissions",
            "Medical Records",
            "Nurses",
            "Rooms",
            "Beds",
            "Ward Dashboard",
            "Nurse Assignments",
            "Nursing Notes",
            "Medicines",
            "Pharmacy Board",
            "Lab Tests",
            "Lab Results",
            "Test Categories",
            "Radiology",
            "Inventory",
            "Accounts Dashboard",
            "Income",
            "Expense",
            "Salary",
            "Ledger",
            "Billing",
            "Reports",
            "Financial Reports",
            "Users",
            "Employees",
            "Attendance",
            "Payroll",
            "Activity Logs"
        };

        private static readonly Dictionary<string, string[]> DefaultAccess =
            new()
            {
                {
                    "Doctor",
                    new[]
                    {
                        "Dashboard", "Patients", "Doctors", "Appointments",
                        "Admissions", "Medical Records", "Nursing Notes",
                        "Medicines", "Lab Tests", "Lab Results", "Radiology"
                    }
                },
                {
                    "Receptionist",
                    new[]
                    {
                        "Dashboard", "Patients", "Appointments",
                        "Admissions", "Billing"
                    }
                },
                {
                    "Nurse",
                    new[]
                    {
                        "Dashboard", "Patients", "Admissions", "Medical Records",
                        "Nursing Notes", "Nurse Assignments", "Medicines", "Ward Dashboard"
                    }
                },
                {
                    "Patient",
                    new[] { "Dashboard" }
                }
            };

        public RolePermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // ── Get permissions by role (Admin only) ──
        [HttpGet("role/{roleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByRole(int roleId)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleId == roleId);

            if (role == null)
                return NotFound("Role not found");

            var saved = await _context.RolePermissions
                .Where(x => x.RoleId == roleId)
                .ToListAsync();

            var result = AllModules.Select(module => new
            {
                RolePermissionId =
                    saved.FirstOrDefault(x => x.ModuleName == module)
                    ?.RolePermissionId ?? 0,
                RoleId = roleId,
                ModuleName = module,
                HasAccess =
                    saved.FirstOrDefault(x => x.ModuleName == module)
                    ?.HasAccess ?? false
            });

            return Ok(result);
        }


        // ── Update single permission (Admin only) ──
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdatePermissionDto dto)  // FIX: object দিয়ে receive
        {
            var permission = await _context.RolePermissions
                .FirstOrDefaultAsync(x => x.RolePermissionId == id);

            if (permission == null)
                return NotFound();

            permission.HasAccess = dto.HasAccess;
            await _context.SaveChangesAsync();

            return Ok(permission);
        }


        // ── Seed default permissions ──
        [HttpPost("seed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Seed()
        {
            var roles = await _context.Roles.ToListAsync();

            foreach (var role in roles)
            {
                var oldPermissions = await _context.RolePermissions
                    .Where(x => x.RoleId == role.RoleId)
                    .ToListAsync();

                foreach (var module in AllModules)
                {
                    if (oldPermissions.Any(x => x.ModuleName == module))
                        continue;

                    bool access = false;

                    if (role.RoleName.Equals("Admin", StringComparison.OrdinalIgnoreCase))
                        access = true;
                    else if (DefaultAccess.ContainsKey(role.RoleName))
                        access = DefaultAccess[role.RoleName].Contains(module);

                    _context.RolePermissions.Add(new RolePermission
                    {
                        RoleId = role.RoleId,
                        ModuleName = module,
                        HasAccess = access
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Permission seed completed" });
        }


        // ── Current logged-in user এর permission ──  FIX: JWT থেকে role নেয়
        [HttpGet("my-permissions")]
        public async Task<IActionResult> MyPermissions()
        {
            // JWT token থেকে role নেওয়া
            var roleName = User.FindFirstValue(ClaimTypes.Role)
                        ?? User.FindFirstValue("role")
                        ?? "";

            if (string.IsNullOrEmpty(roleName))
                return Unauthorized("Role not found in token");

            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleName == roleName);

            if (role == null)
                return NotFound("Role not found");

            var permissions = await _context.RolePermissions
                .Where(x => x.RoleId == role.RoleId)
                .Select(x => new
                {
                    x.ModuleName,
                    x.HasAccess
                })
                .ToListAsync();

            return Ok(permissions);
        }
    }


    // ── DTO for Update ──
    public class UpdatePermissionDto
    {
        public bool HasAccess { get; set; }
    }
}