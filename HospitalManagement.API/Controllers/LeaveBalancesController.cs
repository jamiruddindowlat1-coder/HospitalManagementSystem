using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaveBalancesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public LeaveBalancesController(ApplicationDbContext context)
        {
            _context=context;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var data = await _context.LeaveBalances
                .Include(x=>x.Employee)
                .Select(x=>new LeaveBalanceDto
                {
                    LeaveBalanceId=x.LeaveBalanceId,
                    EmployeeId=x.EmployeeId,
                    EmployeeName=x.Employee!.FullName,
                    CasualLeave=x.CasualLeave,
                    SickLeave=x.SickLeave,
                    EarnedLeave=x.EarnedLeave,
                    Year=x.Year
                })
                .ToListAsync();

            return Ok(data);
        }



        [HttpPost]
        public async Task<IActionResult> Create(LeaveBalanceCreateDto dto)
        {

            var item=new LeaveBalance
            {
                EmployeeId=dto.EmployeeId,
                CasualLeave=dto.CasualLeave,
                SickLeave=dto.SickLeave,
                EarnedLeave=dto.EarnedLeave,
                Year=dto.Year
            };


            _context.LeaveBalances.Add(item);

            await _context.SaveChangesAsync();


            return Ok(item);
        }

    }
}