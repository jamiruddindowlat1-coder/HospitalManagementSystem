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

                    page.Header().Row(row =>
                    {
                        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "shms_logo.jpg");
                        if (File.Exists(imagePath))
                        {
                            row.ConstantItem(40).Image(imagePath);
                            row.Spacing(10);
                        }
                        row.RelativeItem().Column(col => 
                        {
                            col.Item().Text(title).FontSize(20).Bold();
                        });
                    });


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
                        .Text("Sayan Hospital Management System");
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


            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "shms_logo.jpg");
            if (File.Exists(imagePath))
            {
                sheet.AddPicture(imagePath).MoveTo(sheet.Cell(1, 1)).Scale(0.2);
                sheet.Row(1).Height = 40;
                sheet.Cell(2, 1).Value = title;
                sheet.Cell(2, 1).Style.Font.Bold = true;
            }
            else
            {
                sheet.Cell(1, 1).Value = title;
            }

            int row = 4;


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