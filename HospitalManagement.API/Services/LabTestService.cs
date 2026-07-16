using HospitalManagement.API.Data;
using HospitalManagement.API.DTOs;
using HospitalManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.API.Services
{
    public class LabTestService
    {
        private readonly ApplicationDbContext _context;

        public LabTestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<LabTestDto>> GetAllAsync()
        {
            return await _context.LabTests
                .Include(l => l.Patient)
                .Include(l => l.Doctor)
                .Select(l => new LabTestDto
                {
                    LabTestId = l.LabTestId,
                    PatientId = l.PatientId,
                    PatientName = l.Patient != null ? l.Patient.FullName : null,
                    DoctorId = l.DoctorId,
                    DoctorName = l.Doctor != null ? l.Doctor.FullName : null,
                    TestName = l.TestName,
                    TestType = l.TestType,
                    Status = l.Status,
                    OrderedDate = l.OrderedDate,
                    ResultDate = l.ResultDate,
                    Result = l.Result,
                    Notes = l.Notes
                })
                .ToListAsync();
        }

        public async Task<LabTestDto?> GetByIdAsync(int id)
        {
            var l = await _context.LabTests
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.LabTestId == id);

            if (l == null) return null;

            return new LabTestDto
            {
                LabTestId = l.LabTestId,
                PatientId = l.PatientId,
                PatientName = l.Patient != null ? l.Patient.FullName : null,
                DoctorId = l.DoctorId,
                DoctorName = l.Doctor != null ? l.Doctor.FullName : null,
                TestName = l.TestName,
                TestType = l.TestType,
                Status = l.Status,
                OrderedDate = l.OrderedDate,
                ResultDate = l.ResultDate,
                Result = l.Result,
                Notes = l.Notes
            };
        }

        public async Task<LabTest> CreateAsync(LabTestCreateDto dto)
        {
            var labTest = new LabTest
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                TestName = dto.TestName,
                TestType = dto.TestType,
                Status = dto.Status,
                OrderedDate = dto.OrderedDate ?? DateTime.Now,
                ResultDate = dto.ResultDate,
                Result = dto.Result,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };

            _context.LabTests.Add(labTest);
            await _context.SaveChangesAsync();
            return labTest;
        }

        public async Task<bool> UpdateAsync(int id, LabTestCreateDto dto)
        {
            var labTest = await _context.LabTests.FindAsync(id);
            if (labTest == null) return false;

            labTest.PatientId = dto.PatientId;
            labTest.DoctorId = dto.DoctorId;
            labTest.TestName = dto.TestName;
            labTest.TestType = dto.TestType;
            labTest.Status = dto.Status;
            labTest.OrderedDate = dto.OrderedDate ?? labTest.OrderedDate;
            labTest.ResultDate = dto.ResultDate;
            labTest.Result = dto.Result;
            labTest.Notes = dto.Notes;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var labTest = await _context.LabTests.FindAsync(id);
            if (labTest == null) return false;

            _context.LabTests.Remove(labTest);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}