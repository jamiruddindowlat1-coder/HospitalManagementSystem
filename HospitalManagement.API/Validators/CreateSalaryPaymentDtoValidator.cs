using FluentValidation;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Validators
{
    public class CreateSalaryPaymentDtoValidator : AbstractValidator<CreateSalaryPaymentDto>
    {
        public CreateSalaryPaymentDtoValidator()
        {
            RuleFor(x => x.StaffType)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.StaffId)
                .GreaterThan(0);

            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithMessage("Amount must be greater than zero.");

            RuleFor(x => x.PaymentMonth)
                .NotEmpty()
                .MaximumLength(20);

            RuleFor(x => x.PaymentDate)
                .NotEmpty();

            RuleFor(x => x.Status)
                .NotEmpty()
                .Must(status => status == "Paid" || status == "Pending")
                .WithMessage("Status must be either 'Paid' or 'Pending'.");

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .When(x => !string.IsNullOrWhiteSpace(x.Notes));
        }
    }
}