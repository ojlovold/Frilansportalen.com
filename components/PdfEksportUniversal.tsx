import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type EksportType = "rapporter" | "faktura" | "kjørebok";

interface Props {
  type: EksportType;
  data: any[];
  tittel?: string;
}

export default function PdfEksportUniversal({ type, data, tittel }: Props) {
  const lastNed = () => {
    const doc = new jsPDF();

    const dato = new Date().toLocaleDateString("no-NO");

    const konfig = {
      rapporter: {
        tittel: tittel || "Mine rapporter",
        kolonner: ["Tittel", "Dato", "Status"],
        rader: data.map((r) => [r.tittel, r.dato, r.status]),
      },
      faktura: {
        tittel: tittel || "Fakturajournal",
        kolonner: ["#ID", "Kunde", "Beløp", "Dato"],
        rader: data.map((f) => [f.id, f.kunde, `${f.beløp} kr`, f.dato]),
      },
      kjørebok: {
        tittel: tittel || "Kjørebok",
        kolonner: ["Dato", "Start", "Stopp", "Km", "Formål"],
        rader: data.map((k) => [k.dato, k.start, k.stopp, k.km, k.formål]),
      }
    };

    const { kolonner, rader } = konfig[type];
    const overskrift = konfig[type].tittel;

    doc.setFontSize(18);
    doc.text(overskrift, 14, 20);
    doc.setFontSize(11);
    doc.text(`Dato: ${dato}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [kolonner],
      body: rader,
    });

    doc.save(`${overskrift.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
  };

  return (
    <button
      onClick={lastNed}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Last ned som PDF
    </button>
  );
}
