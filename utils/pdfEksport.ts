import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFData {
  tittel: string;
  filnavn: string;
  kolonner: string[];
  rader: any[][];
}

export function generatePDF({ tittel, filnavn, kolonner, rader }: PDFData) {
  const doc = new jsPDF();

  doc.text(tittel, 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [kolonner],
    body: rader,
  });

  doc.save(`${filnavn}.pdf`);
}
