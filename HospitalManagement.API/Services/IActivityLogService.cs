namespace HospitalManagement.API.Services
{
    public interface IActivityLogService
    {
        Task LogAsync(string action, string entity, string description, int? userId);
    }
}