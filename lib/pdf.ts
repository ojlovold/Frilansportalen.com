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

  // Logo (hvis ønsket)
  if (brukLogo) {
    try {
      const logoUrl = "https://<ditt-prosjekt>.supabase.co/storage/v1/object/public/logoer/frilansportalen.png"; // juster etter behov
      const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.25);
      page.drawImage(logoImage, {
        x: width - logoDims.width - 50,
        y: height - logoDims.height - 40,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (err) {
      console.warn("Klarte ikke å laste logo:", err);
    }
  }

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
