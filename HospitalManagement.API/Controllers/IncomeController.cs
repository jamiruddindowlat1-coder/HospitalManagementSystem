using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Services;
using HospitalManagement.API.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IActivityLogService _activityLog;


        public IncomeController(
            ApplicationDbContext context,
            IActivityLogService activityLog)
        {
            _context = context;
            _activityLog = activityLog;
        }



        // GET: api/Income

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeDto>>> GetIncomes()
        {
            var incomes = await _context.Incomes
                .OrderByDescending(x => x.IncomeDate)
                .ToListAsync();


            var result = incomes.Select(x => new IncomeDto
            {
                IncomeId = x.IncomeId,
                Source = x.Source,
                Description = x.Description,
                Amount = x.Amount,
                IncomeDate = x.IncomeDate,
                ReferenceNumber = x.ReferenceNumber,
                CreatedAt = x.CreatedAt

            });


            return Ok(result);
        }





        // GET: api/Income/{id}

        [HttpGet("{id:int}")]
        public async Task<ActionResult<IncomeDto>> GetIncome(int id)
        {
            var income = await _context.Incomes
                .FirstOrDefaultAsync(x => x.IncomeId == id);


            if(income == null)
                return NotFound();



            return Ok(new IncomeDto
            {
                IncomeId = income.IncomeId,
                Source = income.Source,
                Description = income.Description,
                Amount = income.Amount,
                IncomeDate = income.IncomeDate,
                ReferenceNumber = income.ReferenceNumber,
                CreatedAt = income.CreatedAt
            });
        }





        // POST: api/Income

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> CreateIncome(CreateIncomeDto dto)
        {

            var income = new Income
            {
                Source = dto.Source,
                Description = dto.Description,
                Amount = dto.Amount,
                IncomeDate = dto.IncomeDate,
                ReferenceNumber = dto.ReferenceNumber,
                CreatedAt = DateTime.Now
            };


            _context.Incomes.Add(income);

            await _context.SaveChangesAsync();



            await _activityLog.LogAsync(
                "Created",
                "Income",
                $"Income {income.Source} created Amount {income.Amount}",
                User.GetUserId()
            );



            return CreatedAtAction(
                nameof(GetIncome),
                new {id = income.IncomeId},
                income
            );
        }







        // PUT: api/Income/{id}

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateIncome(
            int id,
            CreateIncomeDto dto)
        {


            var income = await _context.Incomes
                .FirstOrDefaultAsync(x => x.IncomeId == id);



            if(income == null)
                return NotFound();




            income.Source = dto.Source;

            income.Description = dto.Description;

            income.Amount = dto.Amount;

            income.IncomeDate = dto.IncomeDate;

            income.ReferenceNumber = dto.ReferenceNumber;




            await _context.SaveChangesAsync();





            await _activityLog.LogAsync(
                "Updated",
                "Income",
                $"Income {income.Source} updated Amount {income.Amount}",
                User.GetUserId()
            );



            return NoContent();

        }







        // DELETE: api/Income/{id}

// DELETE: api/Income/{id}

// DELETE: api/Income/{id}

[Authorize(Roles = "Admin")]
[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteIncome(int id)
{
    var income = await _context.Incomes
        .FirstOrDefaultAsync(x => x.IncomeId == id);


    if (income == null)
        return NotFound();



    // Delete related Ledger Entries first
    var ledgerEntries = await _context.LedgerEntries
        .Where(x => x.IncomeId == id)
        .ToListAsync();


    if (ledgerEntries.Any())
    {
        _context.LedgerEntries.RemoveRange(ledgerEntries);
    }



    // Delete Income
    _context.Incomes.Remove(income);


    await _context.SaveChangesAsync();



    await _activityLog.LogAsync(
        "Deleted",
        "Income",
        $"Income {income.Source} deleted",
        User.GetUserId()
    );


    return NoContent();
}

    }
}