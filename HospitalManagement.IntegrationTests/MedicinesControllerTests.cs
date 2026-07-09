using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using FluentAssertions;
using HospitalManagement.API.DTOs;

namespace HospitalManagement.IntegrationTests;

public class MedicinesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public MedicinesControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_WithoutToken_ShouldReturn401()
    {
        var response = await _client.GetAsync("/api/medicines");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAll_WithValidToken_ShouldReturn200()
    {
        var token = await GetJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/medicines");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Create_WithValidData_ShouldReturnSuccess()
    {
        var token = await GetJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var dto = new MedicineCreateDto
        {
            MedicineName  = "Napa Extra",
            Manufacturer  = "Beximco Pharma",
            UnitPrice     = 12.50m,
            StockQuantity = 200,
            ExpiryDate    = DateTime.UtcNow.AddYears(2),
            Category      = "Painkiller",
            BatchNumber   = "BX-2026-001"
        };

        var response = await _client.PostAsJsonAsync("/api/medicines", dto);
        response.IsSuccessStatusCode.Should().BeTrue(because: "create should succeed");
    }

    [Fact]
    public async Task GetById_WhenNotExists_ShouldReturn404()
    {
        var token = await GetJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/api/medicines/99999");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_WhenNotExists_ShouldReturn404()
    {
        var token = await GetJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.DeleteAsync("/api/medicines/99999");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_WithoutName_ShouldReturn400()
    {
        var token = await GetJwtTokenAsync();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var dto = new MedicineCreateDto
        {
            MedicineName  = "",
            StockQuantity = 10,
            ExpiryDate    = DateTime.UtcNow.AddYears(1)
        };

        var response = await _client.PostAsJsonAsync("/api/medicines", dto);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private async Task<string> GetJwtTokenAsync()
    {
        var loginData = new
        {
            Email    = "admin@hospital.local",
            Password = "Admin123!"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/login", loginData);
        response.IsSuccessStatusCode.Should().BeTrue(because: "login should succeed");

        var result = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
        return result?.Token ?? throw new Exception("Token was null");
    }
}