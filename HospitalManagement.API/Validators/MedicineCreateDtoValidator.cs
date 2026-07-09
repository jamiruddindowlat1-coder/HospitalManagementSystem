using FluentValidation;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.API.Validators
{
    public class MedicineCreateDtoValidator : AbstractValidator<MedicineCreateDto>
    {
        public MedicineCreateDtoValidator()
        {
            RuleFor(m => m.MedicineName)
                .NotEmpty().WithMessage("Medicine name is required.")
                .MaximumLength(150);

            RuleFor(m => m.UnitPrice)
                .GreaterThan(0).WithMessage("Unit price must be greater than 0.");

            RuleFor(m => m.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

            RuleFor(m => m.ExpiryDate)
                .GreaterThan(DateTime.Now).WithMessage("Expiry date must be in the future.");

            RuleFor(m => m.Manufacturer)
                .MaximumLength(150);
        }
    }
}