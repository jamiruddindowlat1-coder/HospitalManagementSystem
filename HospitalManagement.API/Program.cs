using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

using HospitalManagement.API.Data;
using HospitalManagement.API.Models;


var builder = WebApplication.CreateBuilder(args);


// ==========================
// Controllers
// ==========================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();


builder.Services.AddEndpointsApiExplorer();



// ==========================
// Swagger + JWT
// ==========================

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter JWT Token"
        });


    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [
                new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document)
            ] = new List<string>()
        });
});



// ==========================
// Database
// ==========================

if (builder.Environment.IsEnvironment("Testing"))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseInMemoryDatabase("Hospital_Test_DB");
    });
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseSqlServer(
            builder.Configuration
            .GetConnectionString("DefaultConnection"));
    });
}



// ==========================
// JWT
// ==========================

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));


var jwtSettings =
    builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>(); if (jwtSettings != null) { jwtSettings.Key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY"); }


if(jwtSettings == null ||
   string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException(
        "JWT settings missing.");
}



var key =
    Encoding.UTF8.GetBytes(jwtSettings.Key);



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;

})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;

    options.SaveToken = true;


    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,

            IssuerSigningKey =
                new SymmetricSecurityKey(key),

            ValidateIssuer = true,

            ValidateAudience = true,

            ValidIssuer =
                jwtSettings.Issuer,

            ValidAudience =
                jwtSettings.Audience,

            ClockSkew =
                TimeSpan.FromMinutes(2)
        };

});



// ==========================
// Authorization
// ==========================

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy =
        new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});



// ==========================
// CORS
// ==========================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});



var app = builder.Build();



// ==========================
// Database Initialize
// ==========================

using(var scope = app.Services.CreateScope())
{
    var db =
        scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();


    db.Database.EnsureCreated();


    if(!app.Environment.IsEnvironment("Testing"))
    {
        DbInitializer.Seed(db);
    }
}



// ==========================
// Swagger
// ==========================

if(app.Environment.IsDevelopment() ||
   app.Environment.IsEnvironment("Testing"))
{
    app.UseSwagger();

    app.UseSwaggerUI();
}



app.UseHttpsRedirection();


app.UseCors("AllowReactApp");


app.UseAuthentication();


app.UseAuthorization();

// ==========================
// Middleware
// ==========================

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();


// ==========================
// Run Application
// ==========================

app.Run();


// Required for Integration Tests
public partial class Program
{

}


