import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async function generateSimplePDF(
  tittel: string,
  innhold: string,
  brukerId: string,
  brukLogo: boolean = true
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 14;

  const marginTop = 60;
  const lineHeight = 24;

  // Tittel
  page.drawText(tittel, {
    x: 50,
    y: height - marginTop,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });

  // Innhold
  const linjer = innhold.split("\n");
  linjer.forEach((linje, i) => {
    page.drawText(linje, {
      x: 50,
      y: height - marginTop - 40 - i * lineHeight,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  // Bruker-ID nederst
  page.drawText(`Bruker-ID: ${brukerId}`, {
    x: 50,
    y: 30,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
