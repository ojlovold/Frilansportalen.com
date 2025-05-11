import { jsPDF } from "jspdf";

interface Props {
  attest: {
    id: string;
    type: string;
    filnavn: string;
    url: string;
    utløper: string;
    opplastet: string;
  };
}

export default function EksporterAttestPDF({ attest }: Props) {
  const lastNed = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Attest – Frilansportalen", 10, 20);

    doc.setFontSize(11);
    doc.text(`Type: ${attest.type}`, 10, 35);
    doc.text(`Filnavn: ${attest.filnavn}`, 10, 43);
    doc.text(`Nedlastingslenke:`, 10, 51);
    doc.text(attest.url, 10, 59);
    doc.text(`Utløpsdato: ${new Date(attest.utløper).toLocaleDateString()}`, 10, 75);
    doc.text(`Opplastet: ${new Date(attest.opplastet).toLocaleDateString()}`, 10, 83);

    doc.save(`attest_${attest.id}.pdf`);
  };

  return (
    <button onClick={lastNed} className="text-sm underline text-blue-600">
      Last ned PDF
    </button>
  );
}
