import PdfEksportUniversal from "./PdfEksportUniversal";

interface Props {
  data: any[];
}

export default function AutoPDFKnapp({ data }: Props) {
  if (!data || data.length === 0) return null;

  const eksempel = data[0];

  let type: "rapporter" | "faktura" | "kjørebok" | null = null;

  if ("formål" in eksempel && "km" in eksempel) type = "kjørebok";
  else if ("beløp" in eksempel && "kunde" in eksempel) type = "faktura";
  else if ("status" in eksempel && "tittel" in eksempel) type = "rapporter";

  if (!type) return null;

  return <PdfEksportUniversal type={type} data={data} />;
}
