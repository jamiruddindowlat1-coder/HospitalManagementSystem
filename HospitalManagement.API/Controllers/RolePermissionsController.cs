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

        // All modules in the system. Keep this list in sync with the frontend sidebar.
        private static readonly string[] AllModules = new[]
        {
            "Dashboard", "Departments", "Patients", "Doctors", "Appointments", "Admissions",
            "Medical Records", "Nurses", "Rooms", "Beds", "Ward Dashboard", "Nurse Assignments",
            "Nursing Notes", "Medicines", "Pharmacy Board", "Lab Tests", "Lab Results",
            "Test Categories", "Radiology", "Inventory", "Accounts Dashboard", "Income",
            "Expense", "Salary", "Ledger", "Billing", "Reports", "Financial Reports",
            "Users", "Employees", "Attendance", "Payroll", "Activity Logs"
        };

        // Default module access per role name (used only during seeding).
        private static readonly Dictionary<string, string[]> DefaultAccessByRole = new()
        {
            ["Doctor"] = new[]
            {
                "Dashboard", "Patients", "Doctors", "Appointments", "Admissions",
                "Medical Records", "Nursing Notes", "Medicines", "Lab Tests", "Lab Results", "Radiology"
            },
            ["Receptionist"] = new[]
            {
                "Dashboard", "Patients", "Doctors", "Appointments", "Admissions",
                "Billing", "Rooms", "Beds"
            },
            ["Nurse"] = new[]
            {
                "Dashboard", "Patients", "Nurses", "Rooms", "Beds", "Ward Dashboard",
                "Nurse Assignments", "Nursing Notes", "Medicines", "Admissions", "Medical Records"
            },
            ["Patient"] = Array.Empty<string>()
        };

        public RolePermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/RolePermissions/my-permissions
        // Returns the module access list for the currently logged-in user, based on their JWT role claim.
        [HttpGet("my-permissions")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyPermissions()
        {
            var roleName = User.FindFirstValue(ClaimTypes.Role);

            if (string.IsNullOrEmpty(roleName))
                return Unauthorized(new { message = "Role claim not found in token." });

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == roleName);

            if (role == null)
                return NotFound(new { message = $"Role '{roleName}' not found." });

            var permissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == role.RoleId)
                .Select(rp => new
                {
                    rp.ModuleName,
                    rp.HasAccess
                })
                .ToListAsync();

            return Ok(permissions);
        }

        // GET: api/RolePermissions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var permissions = await _context.RolePermissions
                .Include(rp => rp.Role)
                .OrderBy(rp => rp.RoleId)
                .ThenBy(rp => rp.ModuleName)
                .Select(rp => new
                {
                    rp.RolePermissionId,
                    rp.RoleId,
                    RoleName = rp.Role != null ? rp.Role.RoleName : null,
                    rp.ModuleName,
                    rp.HasAccess
                })
                .ToListAsync();

            return Ok(permissions);
        }

        // GET: api/RolePermissions/role/5
        [HttpGet("role/{roleId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetByRole(int roleId)
        {
            var permissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .OrderBy(rp => rp.ModuleName)
                .Select(rp => new
                {
                    rp.RolePermissionId,
                    rp.RoleId,
                    rp.ModuleName,
                    rp.HasAccess
                })
                .ToListAsync();

            if (!permissions.Any())
                return NotFound(new { message = "No permissions found for this role. Try seeding first." });

            return Ok(permissions);
        }

        // PUT: api/RolePermissions/5
        public class UpdatePermissionDto
        {
            public bool HasAccess { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] UpdatePermissionDto dto)
        {
            var permission = await _context.RolePermissions.FindAsync(id);
            if (permission == null)
                return NotFound(new { message = "Permission not found." });

            permission.HasAccess = dto.HasAccess;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                permission.RolePermissionId,
                permission.RoleId,
                permission.ModuleName,
                permission.HasAccess
            });
        }

        // POST: api/RolePermissions/seed
        // Creates default rows for every role x module combination that doesn't already exist.
        // Safe to call multiple times - it only fills in missing rows.
        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {
            var roles = await _context.Roles.ToListAsync();
            if (!roles.Any())
                return BadRequest(new { message = "No roles found. Create roles first." });

            var existing = await _context.RolePermissions
                .Select(rp => new { rp.RoleId, rp.ModuleName })
                .ToListAsync();

            var existingSet = existing
                .Select(e => (e.RoleId, e.ModuleName))
                .ToHashSet();

            var toAdd = new List<RolePermission>();

            foreach (var role in roles)
            {
                var isAdmin = string.Equals(role.RoleName, "Admin", StringComparison.OrdinalIgnoreCase);
                var defaultModules = DefaultAccessByRole.TryGetValue(role.RoleName, out var mods)
                    ? mods
                    : Array.Empty<string>();

                foreach (var moduleName in AllModules)
                {
                    if (existingSet.Contains((role.RoleId, moduleName)))
                        continue;

                    var hasAccess = isAdmin || defaultModules.Contains(moduleName);

                    toAdd.Add(new RolePermission
                    {
                        RoleId = role.RoleId,
                        ModuleName = moduleName,
                        HasAccess = hasAccess
                    });
                }
            }

            if (toAdd.Any())
            {
                _context.RolePermissions.AddRange(toAdd);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = $"Seed complete. {toAdd.Count} new permission rows added." });
        }
    }
}