using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace HospitalManagement.API.Services.Reports
{
    public class ReportExportService
    {
        public byte[] GeneratePdf(string title, IEnumerable<object> data)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);

                    page.Header()
                        .Text(title)
                        .FontSize(20)
                        .Bold();


                    page.Content()
                        .Column(column =>
                        {
                            foreach(var item in data)
                            {
                                column.Item()
                                .Text(item?.ToString() ?? "");
                            }
                        });


                    page.Footer()
                        .AlignCenter()
                        .Text("Hospital Management System");
                });
            });


            return document.GeneratePdf();
        }



        public byte[] GenerateExcel(
            string title,
            IEnumerable<object> data)
        {
            using var workbook = new XLWorkbook();


            var sheet =
                workbook.Worksheets.Add(title);


            sheet.Cell(1,1).Value = title;


            int row = 3;


            foreach(var item in data)
            {
                sheet.Cell(row,1)
                     .Value = item?.ToString() ?? "";

                row++;
            }


            using var stream = new MemoryStream();

            workbook.SaveAs(stream);


            return stream.ToArray();
        }
    }
}