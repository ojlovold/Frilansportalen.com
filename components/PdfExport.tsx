import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Props = {
  fakturaId: string;
  data: {
    tjeneste: string;
    belop: number;
    dato: string;
    mottaker: string;
  };
};

export default function PdfExport({ fakturaId, data }: Props) {
  const lagPdf = () => {
    const doc = new jsPDF();

    doc.text("Faktura", 14, 20);
    doc.text(`Faktura ID: ${fakturaId}`, 14, 30);
    doc.text(`Tjeneste: ${data.tjeneste}`, 14, 40);
    doc.text(`Mottaker: ${data.mottaker}`, 14, 50);
    doc.text(`Dato: ${data.dato}`, 14, 60);
    doc.text(`Beløp: ${data.belop} kr`, 14, 70);

    autoTable(doc, {
      startY: 80,
      head: [["Beskrivelse", "Beløp"]],
      body: [[data.tjeneste, `${data.belop} kr`]],
    });

    doc.save(`faktura_${fakturaId}.pdf`);
  };

  return (
    <button onClick={lagPdf} className="bg-black text-white px-4 py-2 rounded">
      Last ned PDF
    </button>
  );
}
