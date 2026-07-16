using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {

        private readonly ApplicationDbContext _context;


        public DepartmentsController(ApplicationDbContext context)
        {
            _context = context;
        }



        // GET ALL

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {

            var departments = await _context.Departments
                .Include(d => d.Doctors)
                .Select(d => new
                {
                    departmentId = d.DepartmentId,

                    departmentName = d.DepartmentName,

                    description = d.Description,

                    createdAt = d.CreatedAt,


                    doctors = d.Doctors.Select(doc => new
                    {
                        doctorId = doc.DoctorId,

                        fullName = doc.FullName,

                        specialization = doc.Specialization

                    }).ToList()

                })
                .ToListAsync();


            return Ok(departments);

        }





        // GET BY ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {

            var department = await _context.Departments
                .Include(d => d.Doctors)
                .Where(d => d.DepartmentId == id)
                .Select(d => new
                {
                    departmentId = d.DepartmentId,

                    departmentName = d.DepartmentName,

                    description = d.Description,

                    createdAt = d.CreatedAt,


                    doctors = d.Doctors.Select(doc => new
                    {
                        doctorId = doc.DoctorId,

                        fullName = doc.FullName,

                        specialization = doc.Specialization

                    }).ToList()

                })
                .FirstOrDefaultAsync();



            if (department == null)
            {
                return NotFound();
            }


            return Ok(department);

        }





        // CREATE

        [HttpPost]
        public async Task<IActionResult> CreateDepartment(
            Department department)
        {

            department.DepartmentId = 0;

            department.CreatedAt = DateTime.Now;


            _context.Departments.Add(department);


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Department created successfully",

                id = department.DepartmentId
            });

        }





        // UPDATE

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(
            int id,
            Department department)
        {

            var existing = await _context.Departments
                .FindAsync(id);



            if (existing == null)
            {
                return NotFound();
            }



            existing.DepartmentName =
                department.DepartmentName;


            existing.Description =
                department.Description;



            await _context.SaveChangesAsync();



            return Ok(new
            {
                message = "Department updated successfully"
            });

        }





        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {

            var department = await _context.Departments
                .FindAsync(id);



            if (department == null)
            {
                return NotFound();
            }



            _context.Departments.Remove(department);


            await _context.SaveChangesAsync();



            return Ok(new
            {
                message = "Department deleted successfully"
            });

        }

    }
}