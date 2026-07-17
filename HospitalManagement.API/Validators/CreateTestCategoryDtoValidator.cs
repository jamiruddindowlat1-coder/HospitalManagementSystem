using FluentValidation;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Validators
{
    public class CreateTestCategoryDtoValidator : AbstractValidator<CreateTestCategoryDto>
    {
        public CreateTestCategoryDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Test category name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
        }
    }

    public class UpdateTestCategoryDtoValidator : AbstractValidator<UpdateTestCategoryDto>
    {
        public UpdateTestCategoryDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Test category name is required.")
                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
        }
    }
}