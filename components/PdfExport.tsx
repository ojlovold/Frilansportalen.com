import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  tittel: string;
  filnavn: string;
  kolonner: string[];
  rader: any[][];
};

export default function PdfExport({ tittel, filnavn, kolonner, rader }: Props) {
  const lagPdf = () => {
    const doc = new jsPDF();

    doc.text(tittel, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [kolonner],
      body: rader,
    });

    doc.save(`${filnavn}.pdf`);
  };

  return (
    <button onClick={lagPdf} className="bg-black text-white px-4 py-2 rounded text-sm">
      Last ned PDF
    </button>
  );
}
