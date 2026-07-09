using FluentValidation;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Validators
{
    public class PatientValidator : AbstractValidator<Patient>
    {
        public PatientValidator()
        {
            RuleFor(p => p.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(100);

            RuleFor(p => p.Age)
                .InclusiveBetween(0, 150).WithMessage("Age must be between 0 and 150.");

            RuleFor(p => p.Gender)
                .NotEmpty().WithMessage("Gender is required.");

            RuleFor(p => p.ContactNumber)
                .NotEmpty().WithMessage("Contact number is required.")
                .Matches(@"^[0-9+\-\s]{7,15}$").WithMessage("Contact number format is invalid.");

            RuleFor(p => p.Email)
                .EmailAddress().WithMessage("Email format is invalid.")
                .When(p => !string.IsNullOrEmpty(p.Email));

            RuleFor(p => p.EmergencyContactNumber)
                .Matches(@"^[0-9+\-\s]{7,15}$").WithMessage("Emergency contact number format is invalid.")
                .When(p => !string.IsNullOrEmpty(p.EmergencyContactNumber));
        }
    }
}