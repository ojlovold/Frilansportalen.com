import PdfExport from "./PdfExport";

type Type = "rapporter" | "faktura" | "kjørebok";

interface LastNedSomPDFProps {
  type: Type;
  data: any[];
}

export default function LastNedSomPDF({ type, data }: LastNedSomPDFProps) {
  const konfigurasjon = {
    rapporter: {
      tittel: "Mine rapporter",
      kolonner: ["Tittel", "Dato", "Status"],
      rader: data.map((r: any) => [r.tittel, r.dato, r.status]),
    },
    faktura: {
      tittel: "Fakturajournal",
      kolonner: ["Nummer", "Kunde", "Beløp", "Dato"],
      rader: data.map((f: any) => [f.nummer, f.kunde, `${f.beløp} kr`, f.dato]),
    },
    kjørebok: {
      tittel: "Kjørebok",
      kolonner: ["Dato", "Start", "Stopp", "Km", "Formål"],
      rader: data.map((k: any) => [k.dato, k.start, k.stopp, k.km, k.formål]),
    }
  };

  const { tittel, kolonner, rader } = konfigurasjon[type];

  return (
    <PdfExport
      tittel={tittel}
      kolonner={kolonner}
      rader={rader}
    />
  );
}
