using System.Security.Claims;

namespace HospitalManagement.API.Helpers
{
    public static class CurrentUserHelper
    {
        // Extracts the logged-in user's Id from JWT claims (the "sub" claim)
        public static int? GetUserId(this ClaimsPrincipal user)
        {
            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier)
                ?? user.FindFirst("sub");

            if (idClaim != null && int.TryParse(idClaim.Value, out var id))
            {
                return id;
            }

            return null;
        }
    }
}