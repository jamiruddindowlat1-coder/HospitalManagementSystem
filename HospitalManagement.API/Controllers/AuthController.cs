using Microsoft.AspNetCore.RateLimiting;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using HospitalManagement.API.Data;
using HospitalManagement.API.Helpers;
using HospitalManagement.API.Models;

namespace HospitalManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

           [HttpPost("login")]
           [AllowAnonymous]
           [EnableRateLimiting("LoginPolicy")]
           public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            var jwtSettings = _configuration.GetSection("Jwt").Get<JwtSettings>();
            if (jwtSettings == null)
            {
                return StatusCode(500, new { message = "JWT settings missing." });
            }

            var accessToken = GenerateJwtToken(user, jwtSettings);
            var refreshToken = await GenerateAndStoreRefreshToken(user.UserId);

            return Ok(new
            {
                token = accessToken,
                refreshToken = refreshToken.Token,
                expiresAt = refreshToken.ExpiresAt
            });
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required." });
            }

            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u!.Role)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token." });
            }

            if (storedToken.User == null || !storedToken.User.IsActive)
            {
                return Unauthorized(new { message = "User is inactive or not found." });
            }

            var jwtSettings = _configuration.GetSection("Jwt").Get<JwtSettings>();
            if (jwtSettings == null)
            {
                return StatusCode(500, new { message = "JWT settings missing." });
            }

            // Revoke old refresh token (rotation)
            storedToken.IsRevoked = true;

            var newAccessToken = GenerateJwtToken(storedToken.User, jwtSettings);
            var newRefreshToken = await GenerateAndStoreRefreshToken(storedToken.User.UserId);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                token = newAccessToken,
                refreshToken = newRefreshToken.Token,
                expiresAt = newRefreshToken.ExpiresAt
            });
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required." });
            }

            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (storedToken != null)
            {
                storedToken.IsRevoked = true;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Logged out successfully." });
        }

        private async Task<RefreshToken> GenerateAndStoreRefreshToken(int userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = GenerateSecureRandomToken(),
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken;
        }

        private static string GenerateSecureRandomToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private string GenerateJwtToken(User user, JwtSettings settings)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.RoleName ?? string.Empty),
                new Claim("fullName", user.FullName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(settings.DurationMinutes);

            var token = new JwtSecurityToken(
                issuer: settings.Issuer,
                audience: settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}