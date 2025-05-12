import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfExportProps {
  tittel: string;
  kolonner: string[];
  rader: string[][];
}

export default function PdfExport({ tittel, kolonner, rader }: PdfExportProps) {
  const lastNed = () => {
    const doc = new jsPDF();

    // Tittel
    doc.setFontSize(18);
    doc.text(tittel, 14, 20);

    // Dato
    const dato = new Date().toLocaleDateString("no-NO");
    doc.setFontSize(11);
    doc.text(`Dato: ${dato}`, 14, 28);

    // Tabell
    autoTable(doc, {
      startY: 35,
      head: [kolonner],
      body: rader,
    });

    // Lagre PDF
    doc.save(`${tittel.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
  };

  return (
    <button
      onClick={lastNed}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Eksporter til PDF
    </button>
  );
}
