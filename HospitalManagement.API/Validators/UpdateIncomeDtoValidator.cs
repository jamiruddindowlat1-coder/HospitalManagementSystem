using FluentValidation;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Validators
{
    public class UpdateIncomeDtoValidator : AbstractValidator<UpdateIncomeDto>
    {
        public UpdateIncomeDtoValidator()
        {
            RuleFor(x => x.Source)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.Amount)
                .GreaterThan(0);

            RuleFor(x => x.IncomeDate)
                .NotEmpty();
        }
    }
}