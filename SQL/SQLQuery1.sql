-- ============================================================
-- Hospital Management System - Database Schema
-- ============================================================

-- ================= 1. CREATE DATABASE =================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'HospitalManagementDB')
BEGIN
    CREATE DATABASE HospitalManagementDB;
END
GO

USE HospitalManagementDB;
GO

-- ================= 2. DEPARTMENTS =================
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- ================= 3. ROLES =================
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE  -- Admin, Doctor, Receptionist, Patient
);
GO

-- ================= 4. USERS (Login/Auth) =================
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);
GO

-- ================= 5. DOCTORS =================
CREATE TABLE Doctors (
    DoctorId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL,                      -- Link to login account (nullable if no login yet)
    FullName NVARCHAR(100) NOT NULL,
    Specialization NVARCHAR(100) NOT NULL,
    DepartmentId INT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    Email NVARCHAR(150) NULL,
    Qualification NVARCHAR(150) NULL,
    ExperienceYears INT DEFAULT 0,
    ConsultationFee DECIMAL(10,2) DEFAULT 0,
    IsAvailable BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Doctors_Departments FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId),
    CONSTRAINT FK_Doctors_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- ================= 6. PATIENTS =================
CREATE TABLE Patients (
    PatientId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NULL,                      -- Link to login account (nullable for walk-in patients)
    FullName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NULL,
    Age INT NOT NULL,
    Gender NVARCHAR(10) NOT NULL CHECK (Gender IN ('Male','Female','Other')),
    BloodGroup NVARCHAR(5) NULL,
    ContactNumber NVARCHAR(20) NOT NULL,
    Email NVARCHAR(150) NULL,
    Address NVARCHAR(255) NULL,
    EmergencyContactName NVARCHAR(100) NULL,
    EmergencyContactNumber NVARCHAR(20) NULL,
    MedicalHistory NVARCHAR(MAX) NULL,
    RegisteredAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Patients_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- ================= 7. APPOINTMENTS =================
CREATE TABLE Appointments (
    AppointmentId INT PRIMARY KEY IDENTITY(1,1),
    PatientId INT NOT NULL,
    DoctorId INT NOT NULL,
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    Reason NVARCHAR(255) NULL,
    Status NVARCHAR(20) DEFAULT 'Scheduled' CHECK (Status IN ('Scheduled','Completed','Cancelled','NoShow')),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Appointments_Patients FOREIGN KEY (PatientId) REFERENCES Patients(PatientId),
    CONSTRAINT FK_Appointments_Doctors FOREIGN KEY (DoctorId) REFERENCES Doctors(DoctorId)
);
GO

-- ================= 8. MEDICAL RECORDS / PRESCRIPTIONS =================
CREATE TABLE MedicalRecords (
    RecordId INT PRIMARY KEY IDENTITY(1,1),
    AppointmentId INT NOT NULL,
    Diagnosis NVARCHAR(500) NULL,
    Prescription NVARCHAR(MAX) NULL,
    Notes NVARCHAR(MAX) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_MedicalRecords_Appointments FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId)
);
GO

-- ================= 9. ROOMS / WARDS =================
CREATE TABLE Rooms (
    RoomId INT PRIMARY KEY IDENTITY(1,1),
    RoomNumber NVARCHAR(20) NOT NULL UNIQUE,
    RoomType NVARCHAR(50) NOT NULL CHECK (RoomType IN ('General','Private','ICU','Emergency')),
    IsOccupied BIT DEFAULT 0,
    PricePerDay DECIMAL(10,2) DEFAULT 0
);
GO

-- ================= 10. ADMISSIONS (for admitted patients) =================
CREATE TABLE Admissions (
    AdmissionId INT PRIMARY KEY IDENTITY(1,1),
    PatientId INT NOT NULL,
    RoomId INT NOT NULL,
    DoctorId INT NOT NULL,
    AdmissionDate DATETIME DEFAULT GETDATE(),
    DischargeDate DATETIME NULL,
    Status NVARCHAR(20) DEFAULT 'Admitted' CHECK (Status IN ('Admitted','Discharged')),
    CONSTRAINT FK_Admissions_Patients FOREIGN KEY (PatientId) REFERENCES Patients(PatientId),
    CONSTRAINT FK_Admissions_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT FK_Admissions_Doctors FOREIGN KEY (DoctorId) REFERENCES Doctors(DoctorId)
);
GO

-- ================= 11. BILLING / INVOICES =================
CREATE TABLE Billing (
    BillId INT PRIMARY KEY IDENTITY(1,1),
    PatientId INT NOT NULL,
    AppointmentId INT NULL,
    AdmissionId INT NULL,
    ConsultationFee DECIMAL(10,2) DEFAULT 0,
    RoomCharge DECIMAL(10,2) DEFAULT 0,
    MedicineCharge DECIMAL(10,2) DEFAULT 0,
    OtherCharges DECIMAL(10,2) DEFAULT 0,
    TotalAmount AS (ConsultationFee + RoomCharge + MedicineCharge + OtherCharges),
    PaymentStatus NVARCHAR(20) DEFAULT 'Unpaid' CHECK (PaymentStatus IN ('Paid','Unpaid','Partial')),
    BillDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Billing_Patients FOREIGN KEY (PatientId) REFERENCES Patients(PatientId),
    CONSTRAINT FK_Billing_Appointments FOREIGN KEY (AppointmentId) REFERENCES Appointments(AppointmentId),
    CONSTRAINT FK_Billing_Admissions FOREIGN KEY (AdmissionId) REFERENCES Admissions(AdmissionId)
);
GO

-- ================= 12. MEDICINES / PHARMACY INVENTORY =================
CREATE TABLE Medicines (
    MedicineId INT PRIMARY KEY IDENTITY(1,1),
    MedicineName NVARCHAR(150) NOT NULL,
    Manufacturer NVARCHAR(150) NULL,
    UnitPrice DECIMAL(10,2) NOT NULL DEFAULT 0,
    StockQuantity INT NOT NULL DEFAULT 0,
    ExpiryDate DATE NULL
);
GO

-- ================= SEED DATA: Roles =================
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Doctor'), ('Receptionist'), ('Patient');
GO

-- ================= SEED DATA: Departments =================
INSERT INTO Departments (DepartmentName, Description) VALUES
('Cardiology', 'Heart related treatment'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bone and joint treatment'),
('General Medicine', 'General health checkup and treatment'),
('Pediatrics', 'Child healthcare');
GO

-- ================= INDEXES for performance =================
CREATE INDEX IX_Appointments_PatientId ON Appointments(PatientId);
CREATE INDEX IX_Appointments_DoctorId ON Appointments(DoctorId);
CREATE INDEX IX_Doctors_DepartmentId ON Doctors(DepartmentId);
CREATE INDEX IX_Billing_PatientId ON Billing(PatientId);
GO

PRINT 'HospitalManagementDB schema created successfully!';