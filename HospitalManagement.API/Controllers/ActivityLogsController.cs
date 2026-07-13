using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActivityLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/activitylogs/recent?count=10
        // Used by the notification bell (small, fast, no paging)
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetRecentActivities([FromQuery] int count = 10)
        {
            var logs = await _context.ActivityLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .Select(a => new ActivityLogDto
                {
                    Action = a.Action,
                    Entity = a.Entity,
                    Description = a.Description,
                    UserName = a.User != null ? a.User.FullName : null,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return Ok(logs);
        }

        // GET: api/activitylogs?page=1&pageSize=20&entity=Patient&action=Created&search=john
        // Used by the full Activity Log page (filters + pagination)
        [HttpGet]
        public async Task<ActionResult<PagedActivityLogDto>> GetActivityLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? entity = null,
            [FromQuery] string? action = null,
            [FromQuery] string? search = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var query = _context.ActivityLogs
                .Include(a => a.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(entity))
            {
                query = query.Where(a => a.Entity == entity);
            }

            if (!string.IsNullOrWhiteSpace(action))
            {
                query = query.Where(a => a.Action == action);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a => a.Description.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new ActivityLogDto
                {
                    Action = a.Action,
                    Entity = a.Entity,
                    Description = a.Description,
                    UserName = a.User != null ? a.User.FullName : null,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return Ok(new PagedActivityLogDto
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        // GET: api/activitylogs/entities
        // Returns distinct entity names for the filter dropdown
        [HttpGet("entities")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctEntities()
        {
            var entities = await _context.ActivityLogs
                .Select(a => a.Entity)
                .Distinct()
                .OrderBy(e => e)
                .ToListAsync();

            return Ok(entities);
        }
    }
}