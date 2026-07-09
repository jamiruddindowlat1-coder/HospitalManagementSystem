USE HospitalManagementDB;
GO

-- ============================================================
-- Insert Sample Data for Testing
-- ============================================================

-- Insert Roles (if not exists)
IF NOT EXISTS (SELECT 1 FROM Roles)
BEGIN
    INSERT INTO Roles (RoleName) VALUES 
    ('Admin'), 
    ('Doctor'), 
    ('Receptionist'), 
    ('Patient');
    PRINT 'Roles inserted successfully';
END
GO

-- Insert Departments (if not exists)
IF NOT EXISTS (SELECT 1 FROM Departments)
BEGIN
    INSERT INTO Departments (DepartmentName, Description) VALUES
    ('Cardiology', 'Heart and cardiovascular treatment'),
    ('Neurology', 'Brain and nervous system disorders'),
    ('Orthopedics', 'Bone and joint treatment'),
    ('General Medicine', 'General health checkup and treatment'),
    ('Pediatrics', 'Child healthcare and treatment');
    PRINT 'Departments inserted successfully';
END
GO

-- Insert Sample Users
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'dr.smith@hospital.com')
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, RoleId, IsActive) VALUES
    ('Dr. John Smith', 'dr.smith@hospital.com', HASHBYTES('SHA2_256', 'password123'), 2, 1),
    ('Dr. Sarah Johnson', 'dr.johnson@hospital.com', HASHBYTES('SHA2_256', 'password123'), 2, 1),
    ('Receptionist Mike', 'mike@hospital.com', HASHBYTES('SHA2_256', 'password123'), 3, 1),
    ('Patient John', 'patient.john@email.com', HASHBYTES('SHA2_256', 'password123'), 4, 1);
    PRINT 'Users inserted successfully';
END
GO

-- Insert Sample Doctors
IF NOT EXISTS (SELECT 1 FROM Doctors WHERE Email = 'dr.smith@hospital.com')
BEGIN
    INSERT INTO Doctors (UserId, FullName, Specialization, DepartmentId, PhoneNumber, Email, Qualification, ExperienceYears, ConsultationFee, IsAvailable) VALUES
    ((SELECT UserId FROM Users WHERE Email = 'dr.smith@hospital.com'), 'Dr. John Smith', 'Cardiologist', 1, '+880-1711234567', 'dr.smith@hospital.com', 'MD, DM Cardiology', 15, 500.00, 1),
    ((SELECT UserId FROM Users WHERE Email = 'dr.johnson@hospital.com'), 'Dr. Sarah Johnson', 'Neurologist', 2, '+880-1812345678', 'dr.johnson@hospital.com', 'MD, DM Neurology', 12, 450.00, 1);
    PRINT 'Doctors inserted successfully';
END
GO

-- Insert Sample Patients
IF NOT EXISTS (SELECT 1 FROM Patients WHERE Email = 'patient.john@email.com')
BEGIN
    INSERT INTO Patients (UserId, FullName, DateOfBirth, Age, Gender, BloodGroup, ContactNumber, Email, Address, EmergencyContactName, EmergencyContactNumber, MedicalHistory) VALUES
    ((SELECT UserId FROM Users WHERE Email = 'patient.john@email.com'), 'John Doe', '1985-05-15', 39, 'Male', 'O+', '+880-1913456789', 'patient.john@email.com', '123 Main Street, Dhaka', 'Jane Doe', '+880-1913456790', 'Hypertension, Diabetes'),
    (NULL, 'Maria Garcia', '1990-08-22', 34, 'Female', 'AB+', '+880-1614567890', 'maria.garcia@email.com', '456 Oak Ave, Dhaka', 'Carlos Garcia', '+880-1614567891', 'Asthma'),
    (NULL, 'Ahmed Khan', '1992-12-10', 32, 'Male', 'B+', '+880-1715678901', 'ahmed.khan@email.com', '789 Elm Street, Dhaka', 'Fatima Khan', '+880-1715678902', 'None');
    PRINT 'Patients inserted successfully';
END
GO

-- Insert Sample Rooms
IF NOT EXISTS (SELECT 1 FROM Rooms WHERE RoomNumber = '101')
BEGIN
    INSERT INTO Rooms (RoomNumber, RoomType, IsOccupied, PricePerDay) VALUES
    ('101', 'General', 0, 2000.00),
    ('102', 'General', 0, 2000.00),
    ('201', 'Private', 0, 5000.00),
    ('202', 'Private', 0, 5000.00),
    ('301', 'ICU', 0, 15000.00),
    ('302', 'ICU', 0, 15000.00),
    ('401', 'Emergency', 0, 3000.00);
    PRINT 'Rooms inserted successfully';
END
GO

-- Insert Sample Appointments
IF NOT EXISTS (SELECT 1 FROM Appointments WHERE PatientId = (SELECT TOP 1 PatientId FROM Patients))
BEGIN
    DECLARE @PatientId INT, @DoctorId INT;
    SELECT TOP 1 @PatientId = PatientId FROM Patients WHERE Email = 'patient.john@email.com';
    SELECT TOP 1 @DoctorId = DoctorId FROM Doctors WHERE Email = 'dr.smith@hospital.com';
    
    IF @PatientId IS NOT NULL AND @DoctorId IS NOT NULL
    BEGIN
        INSERT INTO Appointments (PatientId, DoctorId, AppointmentDate, AppointmentTime, Reason, Status) VALUES
        (@PatientId, @DoctorId, CAST(GETDATE() + 5 AS DATE), '10:30:00', 'Regular Checkup', 'Scheduled'),
        (@PatientId, @DoctorId, CAST(GETDATE() + 10 AS DATE), '14:00:00', 'Follow-up', 'Scheduled');
        PRINT 'Appointments inserted successfully';
    END
END
GO

-- Insert Sample Medicines
IF NOT EXISTS (SELECT 1 FROM Medicines WHERE MedicineName = 'Aspirin')
BEGIN
    INSERT INTO Medicines (MedicineName, Manufacturer, UnitPrice, StockQuantity, ExpiryDate) VALUES
    ('Aspirin', 'Bayer', 5.50, 1000, '2026-12-31'),
    ('Amoxicillin', 'GSK', 15.00, 500, '2026-11-30'),
    ('Metformin', 'Sun Pharma', 3.00, 2000, '2026-10-31'),
    ('Lisinopril', 'Cipla', 8.00, 800, '2026-09-30'),
    ('Omeprazole', 'Ranbaxy', 12.00, 600, '2026-08-31');
    PRINT 'Medicines inserted successfully';
END
GO

PRINT '';
PRINT '╔════════════════════════════════════════════════════════╗';
PRINT '║  ✓ Sample Data Insertion Complete                      ║';
PRINT '╚════════════════════════════════════════════════════════╝';

-- Show data summary
PRINT '';
PRINT 'Data Summary:';
PRINT '─────────────────────────────────────────────────────────';
SELECT 'Roles' as [Table], COUNT(*) as [Count] FROM Roles
UNION ALL
SELECT 'Departments', COUNT(*) FROM Departments
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'Doctors', COUNT(*) FROM Doctors
UNION ALL
SELECT 'Patients', COUNT(*) FROM Patients
UNION ALL
SELECT 'Appointments', COUNT(*) FROM Appointments
UNION ALL
SELECT 'Medicines', COUNT(*) FROM Medicines
UNION ALL
SELECT 'Rooms', COUNT(*) FROM Rooms
ORDER BY [Table];
