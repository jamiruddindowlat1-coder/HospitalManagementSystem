using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Services
{
    public class NurseService
    {
        private readonly ApplicationDbContext _context;

        public NurseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<NurseDto>> GetAllNursesAsync()
        {
            return await _context.Nurses
                .Include(n => n.Department)
                .Select(n => new NurseDto
                {
                    NurseId = n.NurseId,
                    FullName = n.FullName,
                    Phone = n.Phone,
                    Shift = n.Shift,
                    DepartmentId = n.DepartmentId,
                    DepartmentName = n.Department != null ? n.Department.DepartmentName : null,
                    IsActive = n.IsActive
                })
                .ToListAsync();
        }

        public async Task<NurseDto?> GetNurseByIdAsync(int id)
        {
            var n = await _context.Nurses
                .Include(x => x.Department)
                .FirstOrDefaultAsync(x => x.NurseId == id);

            if (n == null) return null;

            return new NurseDto
            {
                NurseId = n.NurseId,
                FullName = n.FullName,
                Phone = n.Phone,
                Shift = n.Shift,
                DepartmentId = n.DepartmentId,
                DepartmentName = n.Department != null ? n.Department.DepartmentName : null,
                IsActive = n.IsActive
            };
        }

        public async Task<Nurse> CreateNurseAsync(NurseCreateDto dto)
        {
            var nurse = new Nurse
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Shift = dto.Shift,
                DepartmentId = dto.DepartmentId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Nurses.Add(nurse);
            await _context.SaveChangesAsync();
            return nurse;
        }

        public async Task<bool> UpdateNurseAsync(int id, NurseCreateDto dto)
        {
            var nurse = await _context.Nurses.FindAsync(id);
            if (nurse == null) return false;

            nurse.FullName = dto.FullName;
            nurse.Phone = dto.Phone;
            nurse.Shift = dto.Shift;
            nurse.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteNurseAsync(int id)
        {
            var nurse = await _context.Nurses.FindAsync(id);
            if (nurse == null) return false;

            _context.Nurses.Remove(nurse);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}