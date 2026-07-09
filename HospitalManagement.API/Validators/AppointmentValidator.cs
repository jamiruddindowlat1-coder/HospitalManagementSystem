using FluentValidation;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Validators
{
    public class AppointmentValidator : AbstractValidator<Appointment>
    {
        public AppointmentValidator()
        {
            RuleFor(a => a.PatientId)
                .GreaterThan(0).WithMessage("A valid patient must be selected.");

            RuleFor(a => a.DoctorId)
                .GreaterThan(0).WithMessage("A valid doctor must be selected.");

            RuleFor(a => a.AppointmentDate)
                .NotEmpty().WithMessage("Appointment date is required.");

            RuleFor(a => a.Status)
                .NotEmpty().WithMessage("Status is required.")
                .Must(s => new[] { "Scheduled", "Completed", "Cancelled" }.Contains(s))
                .WithMessage("Status must be Scheduled, Completed, or Cancelled.");

            RuleFor(a => a.Reason)
                .MaximumLength(500).WithMessage("Reason cannot exceed 500 characters.");
        }
    }
}