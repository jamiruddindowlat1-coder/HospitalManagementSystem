using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;

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
                        "Dashboard",
                        "Patients",
                        "Doctors",
                        "Appointments",
                        "Admissions",
                        "Medical Records",
                        "Nursing Notes",
                        "Medicines",
                        "Lab Tests",
                        "Lab Results",
                        "Radiology"
                    }
                },

                {
                    "Receptionist",
                    new[]
                    {
                        "Dashboard",
                        "Patients",
                        "Appointments",
                        "Admissions",
                        "Billing"
                    }
                },

                {
                    "Nurse",
                    new[]
                    {
                        "Dashboard",
                        "Patients",
                        "Admissions",
                        "Medical Records",
                        "Nursing Notes",
                        "Nurse Assignments",
                        "Medicines",
                        "Ward Dashboard"
                    }
                },

                {
                    "Patient",
                    new[]
                    {
                        "Dashboard"
                    }
                }
            };


        public RolePermissionsController(ApplicationDbContext context)
        {
            _context = context;
        }



        // Get permissions by role
        [HttpGet("role/{roleId}")]
        public async Task<IActionResult> GetByRole(int roleId)
        {

            var role = await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleId == roleId);


            if(role == null)
            {
                return NotFound("Role not found");
            }


            var saved = await _context.RolePermissions
                .Where(x => x.RoleId == roleId)
                .ToListAsync();



            var result = AllModules.Select(module => new
            {
                RolePermissionId =
                    saved.FirstOrDefault(x=>x.ModuleName==module)
                    ?.RolePermissionId ?? 0,

                RoleId = roleId,

                ModuleName = module,

                HasAccess =
                    saved.FirstOrDefault(x=>x.ModuleName==module)
                    ?.HasAccess ?? false
            });


            return Ok(result);
        }




        // Update single permission
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] bool hasAccess)
        {

            var permission =
                await _context.RolePermissions
                .FirstOrDefaultAsync(x=>x.RolePermissionId==id);


            if(permission==null)
            {
                return NotFound();
            }


            permission.HasAccess = hasAccess;


            await _context.SaveChangesAsync();


            return Ok(permission);
        }




        // Create missing permissions
        [HttpPost("seed")]
        public async Task<IActionResult> Seed()
        {

            var roles =
                await _context.Roles.ToListAsync();


            foreach(var role in roles)
            {

                var oldPermissions =
                    await _context.RolePermissions
                    .Where(x=>x.RoleId==role.RoleId)
                    .ToListAsync();



                foreach(var module in AllModules)
                {

                    if(oldPermissions.Any(x=>x.ModuleName==module))
                        continue;



                    bool access = false;


                    if(role.RoleName.Equals(
                        "Admin",
                        StringComparison.OrdinalIgnoreCase))
                    {
                        access = true;
                    }


                    else if(DefaultAccess
                        .ContainsKey(role.RoleName))
                    {
                        access =
                        DefaultAccess[role.RoleName]
                        .Contains(module);
                    }



                    _context.RolePermissions.Add(
                        new RolePermission
                        {
                            RoleId = role.RoleId,
                            ModuleName = module,
                            HasAccess = access
                        });
                }
            }


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message="Permission seed completed"
            });
        }




        // Current logged user permission
        [HttpGet("my-permissions")]
        public async Task<IActionResult> MyPermissions()
        {

            var user =
                await _context.Users
                .FirstOrDefaultAsync();


            return Ok(
                await _context.RolePermissions
                .Where(x=>x.HasAccess)
                .Select(x=>new
                {
                    x.ModuleName,
                    x.HasAccess
                })
                .ToListAsync()
            );
        }

    }
}