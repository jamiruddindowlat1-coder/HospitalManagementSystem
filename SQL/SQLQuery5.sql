USE HospitalManagementDB;

-- Delete duplicates, keep only the first 5 (lowest DepartmentId per name)
DELETE FROM Departments
WHERE DepartmentId NOT IN (
    SELECT MIN(DepartmentId)
    FROM Departments
    GROUP BY DepartmentName
);