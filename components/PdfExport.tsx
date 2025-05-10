import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PdfExport({
  tittel,
  kolonner,
  rader,
  filnavn,
}: {
  tittel: string;
  kolonner: string[];
  rader: (string | number)[][];
  filnavn: string;
}) {
  const generer = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(tittel, 14, 20);

    autoTable(pdf, {
      head: [kolonner],
      body: rader,
      startY: 30,
    });

    pdf.save(`${filnavn}.pdf`);
  };

  return (
    <button
      onClick={generer}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
    >
      Last ned PDF
    </button>
  );
}
