# Security Setup Guide

## Secret Management

This project uses dotnet user-secrets for local development.
Never commit real secrets to source control.

## Initial Setup (run once after cloning)

cd HospitalManagement.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=YOUR_SERVER;Database=HospitalManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:Key" "your-long-random-secret-minimum-32-characters"
dotnet user-secrets set "Jwt:Issuer" "HospitalManagementSystem"
dotnet user-secrets set "Jwt:Audience" "HospitalManagementUsers"

## Generate a Strong JWT Key (PowerShell)

[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

Copy the output and use it as your Jwt:Key value.

## Production Deployment

Never use user-secrets in production.
Use your hosting provider's secret manager:
- Azure: Azure Key Vault or App Service Configuration
- AWS: AWS Secrets Manager or Parameter Store
- Self-hosted: Environment variables or a secrets vault

## What is Committed vs What is Secret

COMMITTED (safe, in appsettings.json):
- Jwt:Issuer
- Jwt:Audience
- Jwt:ExpiryMinutes
- Placeholder connection string (without real server name)

SECRET (never committed):
- Jwt:Key (the actual signing key)
- Real database connection string with server name/password

## Warning: Leaked Keys

If a real Jwt:Key or database password is ever accidentally committed:
1. Rotate the key immediately (generate a new one)
2. Revoke and replace any affected database credentials
3. Check git log to confirm the secret is no longer in any branch tip
4. Consider using BFG Repo-Cleaner to scrub git history if the repo is public

## Role-Based Access Control

Roles in this system: Admin, Doctor, Nurse, Receptionist, Patient
Defined in: Models/Role.cs and seeded via EF Core migrations
Applied via: [Authorize(Roles = "Admin")] on controllers

## JWT Token Flow

1. POST /api/auth/login with email + password
2. Server returns access token (short-lived) + refresh token (long-lived)
3. Client stores tokens and sends Authorization: Bearer <token> on each request
4. On expiry, client calls POST /api/auth/refresh with the refresh token
5. Refresh tokens are stored hashed in the database