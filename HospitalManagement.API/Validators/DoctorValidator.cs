using FluentValidation;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Validators
{
    public class DoctorValidator : AbstractValidator<Doctor>
    {
        public DoctorValidator()
        {
            RuleFor(d => d.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(100);

            RuleFor(d => d.Specialization)
                .NotEmpty().WithMessage("Specialization is required.")
                .MaximumLength(100);

            RuleFor(d => d.DepartmentId)
                .GreaterThan(0).WithMessage("A valid department must be selected.");

            RuleFor(d => d.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"^[0-9+\-\s]{7,15}$").WithMessage("Phone number format is invalid.");

            RuleFor(d => d.Email)
                .EmailAddress().WithMessage("Email format is invalid.")
                .When(d => !string.IsNullOrEmpty(d.Email));

            RuleFor(d => d.ExperienceYears)
                .InclusiveBetween(0, 60).WithMessage("Experience years must be between 0 and 60.");

            RuleFor(d => d.ConsultationFee)
                .GreaterThanOrEqualTo(0).WithMessage("Consultation fee cannot be negative.");
        }
    }
}