# Hospital Management System (HMS)

A production-style, multi-module hospital management platform built with .NET 10 Web API, Entity Framework Core, and React + Vite. Covers the full lifecycle of hospital operations: patient intake, doctor scheduling, nursing care, pharmacy, lab & radiology diagnostics, accounts & billing, HR/payroll, and management reporting.

---

## Screenshots
See docs/screenshots/ folder for full portfolio screenshots (login, dashboards, ward, financial reports, HR module).

---

## Features

- Patients & Clinical: Patients, Doctors, Appointments, Admissions, Medical Records (bilingual English/Bangla UI)
- Nursing & Wards: Nurses, Rooms, Beds, Ward Board, Nurse Assignments, Vitals & Nursing Notes
- Pharmacy & Lab: Medicine catalogue with expiry tracking, prescription dispensing with auto-billing and low-stock alerts, Lab Tests & Results, Radiology (X-Ray/MRI/CT/Ultrasound/ECG/Echo)
- Inventory: Stock levels, suppliers, storage location, total stock value
- Accounts & Billing: Income, Expense, Salary Payments, double-entry style Ledger with running balance, per-patient invoices
- HR & Employee Management: Employee records, Attendance, Payroll generation, Leave Management
- Reports & Admin: One-click Patients/Doctors/Appointments/Admissions/Medicine/Billing/Medical Record reports (CSV/Excel export), Financial Reports (PDF & Excel export, date-range filter), full Activity Log audit trail, User Management, Role Permissions (RBAC)
- Security: JWT authentication, role-based authorization (Admin, Doctor, Nurse, Receptionist, Patient), FluentValidation on all forms
- Mobile Companion View: mobile-optimised screen for on-duty staff

---

## Tech Stack

Backend: .NET 10 Web API, Entity Framework Core, SQL Server, JWT Authentication, FluentValidation, QuestPDF (PDF export), ClosedXML (Excel export), xUnit + Moq + FluentAssertions (testing)

Frontend: React 19, Vite, React Router v7, Axios, Recharts

---

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- SQL Server (Express edition is fine)

### 1. Clone the repository
git clone https://github.com/jamiruddindowlat1-coder/HospitalManagementSystem.git
cd HospitalManagementSystem

### 2. Backend setup
cd HospitalManagement.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=YOUR_SERVER;Database=HospitalManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:Key" "replace-with-a-long-random-secret"
dotnet ef database update
dotnet run

### 3. Frontend setup
cd ../hospital-frontend
npm install
npm run dev

### 4. Demo Login Credentials
Admin: admin@hospital.local / Admin123!
Doctor: sarah.khan@hospital.local / Doctor123!

Note: These are demo credentials for local evaluation only. Change them before any real deployment.

---

## Configuration (Secrets)

This project does not commit real secrets to source control. Sensitive values are supplied via dotnet user-secrets locally, and via your hosting provider's secret manager in production. See SECURITY_SETUP.md for the full guide.

---

## Running Tests
cd HospitalManagement.Tests
dotnet test

---

## Project Structure
HospitalManagementSystem/
- HospitalManagement.API/      (ASP.NET Core Web API backend)
- hospital-frontend/           (React + Vite frontend)
- HospitalManagement.Tests/    (xUnit test project)
- docs/screenshots/            (Portfolio screenshots)
- SECURITY_SETUP.md
- README.md

---

## Roadmap
- Public live demo deployment (planned)
- CI/CD pipeline - GitHub Actions (planned)
- Structured logging (Serilog) + error tracking (planned)
- Expanded unit/integration test coverage (planned)
- Refresh tokens (done)

---

## Author
Mohammed
GitHub: https://github.com/jamiruddindowlat1-coder

---

## License
MIT License - feel free to use it as a learning reference or a base for your own hospital/clinic management system.
## Portfolio / Case Study
[Full Project Case Study (PDF)](./docs/hms-case-study.pdf)
