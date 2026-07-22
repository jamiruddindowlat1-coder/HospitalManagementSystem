using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HospitalManagement.API.Migrations
{
    public partial class AddLeaveBalanceTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "LeaveBalances",
                columns: table => new
                {
                    LeaveBalanceId = table.Column<int>(
                        type: "int",
                        nullable: false)
                        .Annotation("SqlServer:Identity", "1,1"),

                    EmployeeId = table.Column<int>(
                        type: "int",
                        nullable: false),

                    CasualLeave = table.Column<int>(
                        type: "int",
                        nullable: false),

                    SickLeave = table.Column<int>(
                        type: "int",
                        nullable: false),

                    EarnedLeave = table.Column<int>(
                        type: "int",
                        nullable: false),

                    Year = table.Column<int>(
                        type: "int",
                        nullable: false),

                    CreatedAt = table.Column<DateTime>(
                        type: "datetime2",
                        nullable: false)
                },

                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_LeaveBalances",
                        x => x.LeaveBalanceId);


                    table.ForeignKey(
                        name: "FK_LeaveBalances_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });


            migrationBuilder.CreateIndex(
                name: "IX_LeaveBalances_EmployeeId",
                table: "LeaveBalances",
                column: "EmployeeId");

        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropTable(
                name: "LeaveBalances");

        }
    }
}