import { jsPDF } from "jspdf";

interface Props {
  kontrakt: {
    id: string;
    filnavn: string;
    url: string;
    status: string;
    signert_oppretter: boolean;
    signert_mottaker: boolean;
    opprettet: string;
  };
}

export default function EksporterKontraktPDF({ kontrakt }: Props) {
  const lastNed = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Kontrakt – Frilansportalen", 10, 20);

    doc.setFontSize(11);
    doc.text(`Filnavn: ${kontrakt.filnavn}`, 10, 35);
    doc.text(`URL: ${kontrakt.url}`, 10, 43);
    doc.text(`Status: ${kontrakt.status}`, 10, 51);
    doc.text(`Signert av oppretter: ${kontrakt.signert_oppretter ? "Ja" : "Nei"}`, 10, 59);
    doc.text(`Signert av mottaker: ${kontrakt.signert_mottaker ? "Ja" : "Nei"}`, 10, 67);
    doc.text(`Opprettet: ${new Date(kontrakt.opprettet).toLocaleString()}`, 10, 75);

    doc.save(`kontrakt_${kontrakt.id}.pdf`);
  };

  return (
    <button onClick={lastNed} className="text-sm underline text-blue-600">
      Last ned PDF
    </button>
  );
}
