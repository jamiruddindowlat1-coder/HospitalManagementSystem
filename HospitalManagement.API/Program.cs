using System.Text;
using HospitalManagement.API.Data;
using HospitalManagement.API.Models;
using HospitalManagement.API.Services;
using HospitalManagement.API.Services.Reports;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);


// DATABASE

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));



// SERVICES

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<ReportExportService>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
builder.Services.AddScoped<NurseService>();
builder.Services.AddScoped<LabTestService>();


// CONTROLLERS

builder.Services
.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
    System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});


builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddEndpointsApiExplorer();



// CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
    policy =>
    {
        policy
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});



// SWAGGER

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {token}"
    });

    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// JWT

builder.Services.Configure<JwtSettings>(
builder.Configuration.GetSection("Jwt"));


var jwt =
builder.Configuration
.GetSection("Jwt")
.Get<JwtSettings>();


if(jwt == null || string.IsNullOrEmpty(jwt.Key))
{
    throw new Exception("JWT Missing in appsettings.json");
}



var key =
Encoding.UTF8.GetBytes(jwt.Key);



builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)

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

        ValidIssuer = jwt.Issuer,


        ValidateAudience = true,

        ValidAudience = jwt.Audience,


        ValidateLifetime = true,


        ClockSkew = TimeSpan.Zero

    };

});




// AUTHORIZATION

builder.Services.AddAuthorization(options =>
{

    options.FallbackPolicy =
    new AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build();

});





var app = builder.Build();




// DATABASE SEED

using(var scope = app.Services.CreateScope())
{

    var db =
    scope.ServiceProvider
    .GetRequiredService<ApplicationDbContext>();


    db.Database.EnsureCreated();


    DbInitializer.Seed(db);

}




// SWAGGER

app.UseSwagger();

app.UseSwaggerUI();




// MIDDLEWARE

app.UseHttpsRedirection();


app.UseCors("AllowReactApp");


app.UseAuthentication();


app.UseAuthorization();


app.MapControllers();



app.Run();