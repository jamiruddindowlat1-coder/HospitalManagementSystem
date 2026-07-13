using HospitalManagement.API.Data;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogAsync(string action, string entity, string description, int? userId)
        {
            var log = new ActivityLog
            {
                Action = action,
                Entity = entity,
                Description = description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}