using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelWithSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Billings_Admissions_AdmissionId",
                table: "Billings");

            migrationBuilder.DropForeignKey(
                name: "FK_Billings_Doctors_DoctorId",
                table: "Billings");

            migrationBuilder.DropForeignKey(
                name: "FK_Billings_Patients_PatientId",
                table: "Billings");

            migrationBuilder.DropForeignKey(
                name: "FK_LabResults_LabTests",
                table: "LabResults");

            migrationBuilder.DropForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Appointments",
                table: "MedicalRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Appointments1",
                table: "MedicalRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Doctors_DoctorId",
                table: "MedicalRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Patients_PatientId",
                table: "MedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_AppointmentId",
                table: "MedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_AppointmentId1",
                table: "MedicalRecords");

            migrationBuilder.DropPrimaryKey(
                name: "PK__Billing__11F2FC6A5D9E2DC2",
                table: "Billings");

            migrationBuilder.DropColumn(
                name: "AppointmentId1",
                table: "MedicalRecords");

            migrationBuilder.RenameTable(
                name: "Billings",
                newName: "Billing");

            migrationBuilder.RenameColumn(
                name: "RecordId",
                table: "MedicalRecords",
                newName: "MedicalRecordId");


            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "Billing",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                computedColumnSql: "[ConsultationFee] + [RoomCharge] + [MedicineCharge] + [OtherCharges]",
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Billing",
                table: "Billing",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_AppointmentId",
                table: "MedicalRecords",
                column: "AppointmentId",
                unique: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Billing_Admissions_AdmissionId",
                table: "Billing",
                column: "AdmissionId",
                principalTable: "Admissions",
                principalColumn: "AdmissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Billing_Doctors_DoctorId",
                table: "Billing",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Billing_Patients_PatientId",
                table: "Billing",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LabResults_LabTests",
                table: "LabResults",
                column: "LabTestId",
                principalTable: "LabTests",
                principalColumn: "LabTestId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Appointments_AppointmentId",
                table: "MedicalRecords",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Doctors_DoctorId",
                table: "MedicalRecords",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Patients_PatientId",
                table: "MedicalRecords",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Billing_Admissions_AdmissionId",
                table: "Billing");

            migrationBuilder.DropForeignKey(
                name: "FK_Billing_Doctors_DoctorId",
                table: "Billing");

            migrationBuilder.DropForeignKey(
                name: "FK_Billing_Patients_PatientId",
                table: "Billing");

            migrationBuilder.DropForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults");

            migrationBuilder.DropForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Appointments_AppointmentId",
                table: "MedicalRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Doctors_DoctorId",
                table: "MedicalRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_MedicalRecords_Patients_PatientId",
                table: "MedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_MedicalRecords_AppointmentId",
                table: "MedicalRecords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Billing",
                table: "Billing");

            migrationBuilder.RenameTable(
                name: "Billing",
                newName: "Billings");

            migrationBuilder.RenameColumn(
                name: "MedicalRecordId",
                table: "MedicalRecords",
                newName: "RecordId");

            migrationBuilder.RenameIndex(
                name: "IX_Billing_PatientId",
                table: "Billings",
                newName: "IX_Billings_PatientId");

            migrationBuilder.RenameIndex(
                name: "IX_Billing_DoctorId",
                table: "Billings",
                newName: "IX_Billings_DoctorId");

            migrationBuilder.RenameIndex(
                name: "IX_Billing_AdmissionId",
                table: "Billings",
                newName: "IX_Billings_AdmissionId");

            migrationBuilder.AddColumn<int>(
                name: "AppointmentId1",
                table: "MedicalRecords",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "Billings",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldComputedColumnSql: "[ConsultationFee] + [RoomCharge] + [MedicineCharge] + [OtherCharges]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Billings",
                table: "Billings",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_AppointmentId",
                table: "MedicalRecords",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_AppointmentId1",
                table: "MedicalRecords",
                column: "AppointmentId1",
                unique: true,
                filter: "[AppointmentId1] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Billings_Admissions_AdmissionId",
                table: "Billings",
                column: "AdmissionId",
                principalTable: "Admissions",
                principalColumn: "AdmissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Billings_Doctors_DoctorId",
                table: "Billings",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Billings_Patients_PatientId",
                table: "Billings",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults",
                column: "LabTestId",
                principalTable: "LabTests",
                principalColumn: "LabTestId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LabResults_Patients",
                table: "LabResults",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Appointments_AppointmentId",
                table: "MedicalRecords",
                column: "AppointmentId",
                principalTable: "Appointments",
                principalColumn: "AppointmentId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Appointments_AppointmentId1",
                table: "MedicalRecords",
                column: "AppointmentId1",
                principalTable: "Appointments",
                principalColumn: "AppointmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Doctors_DoctorId",
                table: "MedicalRecords",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "DoctorId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalRecords_Patients_PatientId",
                table: "MedicalRecords",
                column: "PatientId",
                principalTable: "Patients",
                principalColumn: "PatientId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
