using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using Microsoft.AspNetCore.Authorization;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> Summary()
        {
            var today = DateTime.Today;

            var appointmentStatus = await _context.Appointments
                .GroupBy(a => a.Status)
                .Select(g => new { name = g.Key, value = g.Count() })
                .ToListAsync();

            var todaysAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Where(a => a.AppointmentDate.Date == today)
                .Select(a => new
                {
                    a.AppointmentId,
                    PatientName =  a.Patient!.FullName,
                    DoctorName = a.Doctor!.FullName,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Status
                })
                .ToListAsync();

            var recentAdmissions = await _context.Admissions
                .Include(a => a.Patient)
                .Include(a => a.Room)
                .OrderByDescending(a => a.AdmissionDate)
                .Take(5)
                .Select(a => new
                {
                    a.AdmissionId,
                    PatientName =  a.Patient!.FullName,
                    RoomNumber = a.Room!.RoomNumber,
                    a.AdmissionDate,
                    a.Status
                })
                .ToListAsync();

            var emergencyPatients = await _context.Admissions
                .Include(a => a.Patient)
                .Include(a => a.Room)
                .Where(a => a.IsEmergency && a.Status == "Admitted")
                .Select(a => new
                {
                    a.AdmissionId,
                    PatientName =  a.Patient!.FullName,
                    RoomNumber = a.Room!.RoomNumber,
                    a.AdmissionDate
                })
                .ToListAsync();

            var result = new
            {
                Patients = await _context.Patients.CountAsync(),
                Doctors = await _context.Doctors.CountAsync(),
                Appointments = await _context.Appointments.CountAsync(),
                MedicalRecords = await _context.MedicalRecords.CountAsync(),
                Admissions = await _context.Admissions.CountAsync(),
                Medicines = await _context.Medicines.CountAsync(),

                TotalBills = await _context.Billings.CountAsync(),
                PaidBills = await _context.Billings.Where(x => x.PaymentStatus == "Paid").CountAsync(),
                PendingBills = await _context.Billings.Where(x => x.PaymentStatus != "Paid").CountAsync(),
                TotalRevenue = await _context.Billings.SumAsync(x => x.TotalAmount),

                TotalRooms = await _context.Rooms.CountAsync(),
                OccupiedRooms = await _context.Rooms.Where(r => r.IsOccupied).CountAsync(),
                AvailableRooms = await _context.Rooms.Where(r => !r.IsOccupied).CountAsync(),

                TodaysAppointments = todaysAppointments,
                EmergencyPatients = emergencyPatients,
                RecentAdmissions = recentAdmissions,

                AppointmentStatus = appointmentStatus
            };

            return Ok(result);
        }

        [HttpGet("monthly-revenue")]
        public async Task<IActionResult> MonthlyRevenue()
        {
            var sixMonthsAgo = DateTime.Today.AddMonths(-5);
            var startDate = new DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1);

            var bills = await _context.Billings
                .Where(b => b.BillDate >= startDate)
                .Select(b => new { b.BillDate, b.TotalAmount })
                .ToListAsync();

            var grouped = bills
                .GroupBy(b => new { b.BillDate.Year, b.BillDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .ToList();

            var result = Enumerable.Range(0, 6)
                .Select(i => startDate.AddMonths(i))
                .Select(d =>
                {
                    var match = grouped.FirstOrDefault(g => g.Year == d.Year && g.Month == d.Month);
                    return new
                    {
                        month = d.ToString("MMM yyyy"),
                        revenue = match?.Revenue ?? 0
                    };
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("patient-growth")]
        public async Task<IActionResult> PatientGrowth()
        {
            var sixMonthsAgo = DateTime.Today.AddMonths(-5);
            var startDate = new DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1);

            var patients = await _context.Patients
                .Where(p => p.RegisteredAt >= startDate)
                .Select(p => p.RegisteredAt)
                .ToListAsync();

            var grouped = patients
                .GroupBy(d => new { d.Year, d.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToList();

            var result = Enumerable.Range(0, 6)
                .Select(i => startDate.AddMonths(i))
                .Select(d =>
                {
                    var match = grouped.FirstOrDefault(g => g.Year == d.Year && g.Month == d.Month);
                    return new
                    {
                        month = d.ToString("MMM yyyy"),
                        patients = match?.Count ?? 0
                    };
                })
                .ToList();

            return Ok(result);
        }

        [HttpGet("doctors-by-department")]
        public async Task<IActionResult> DoctorsByDepartment()
        {
            var result = await _context.Doctors
                .Include(d => d.Department)
                .GroupBy(d => d.Department != null ? d.Department.DepartmentName : "Unassigned")
                .Select(g => new
                {
                    department = g.Key,
                    count = g.Count()
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("medicine-stock")]
        public async Task<IActionResult> MedicineStock()
        {
            var result = await _context.Medicines
                .GroupBy(m => m.Category ?? "Uncategorized")
                .Select(g => new
                {
                    category = g.Key,
                    stock = g.Sum(m => m.StockQuantity)
                })
                .ToListAsync();

            return Ok(result);
        }

        [HttpGet("room-occupancy")]
        public async Task<IActionResult> RoomOccupancy()
        {
            var rooms = await _context.Rooms
                .Select(r => new { r.RoomType, r.IsOccupied })
                .ToListAsync();

            var result = rooms
                .GroupBy(r => r.RoomType)
                .Select(g => new
                {
                    roomType = g.Key,
                    occupied = g.Count(x => x.IsOccupied),
                    available = g.Count(x => !x.IsOccupied)
                })
                .ToList();

            return Ok(result);
        }
    }
}