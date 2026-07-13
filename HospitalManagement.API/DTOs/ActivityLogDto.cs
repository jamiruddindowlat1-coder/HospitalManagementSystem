namespace HospitalManagement.API.DTOs
{
    public class ActivityLogDto
    {
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PagedActivityLogDto
    {
        public List<ActivityLogDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}