import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AutoUtfyllPDFMedTekst() {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");

  const hentTekstFraPDF = async (fil: File): Promise<string> => {
    const buffer = await fil.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const side = await pdf.getPage(1);
    const tekstinnhold = await side.getTextContent();
    const linjer = tekstinnhold.items.map((item: any) => item.str);
    return linjer.join("\n");
  };

  const les = async () => {
    if (!fil || fil.type !== "application/pdf") {
      setStatus("Vennligst last opp en PDF.");
      return;
    }

    setStatus("Leser PDF...");
    const tekst = await hentTekstFraPDF(fil);
    setTekst(tekst);
    setStatus("Tolker innhold...");

    const belopMatch = tekst.match(/kr\s?([0-9\s]+[,.][0-9]{2})/i);
    const datoMatch = tekst.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);
    const fakturaMatch = tekst.match(/(Faktura|Domene AS|Frilansportalen)/i);

    const tittelLinje = fakturaMatch?.[0] ? `Faktura fra ${fakturaMatch[0]}` : "Kvittering";

    setTittel(tittelLinje);
    setBelop(belopMatch?.[1]?.replace(/\s/g, "").replace(",", ".") || "");
    setDato(datoMatch?.[1] || "");
    setStatus("Utfylt. Klar til lagring.");
  };

  const lagre = async () => {
    if (!fil) return;

    const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(`kvitteringer/${safeFilename}`, fil, { upsert: true });

    if (uploadError) {
      setStatus("Feil ved opplasting.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("dokumenter")
      .getPublicUrl(`kvitteringer/${safeFilename}`);

    const { error } = await supabase.from("admin_utgifter").insert([
      {
        tittel,
        belop: parseFloat(belop),
        valuta,
        dato,
        fil_url: urlData?.publicUrl || null,
      },
    ]);

    if (error) setStatus("Feil ved lagring i databasen.");
    else setStatus("Kvittering lagret!");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Last opp PDF-kvittering (tekstlesing)</h2>

      <input type="file" accept=".pdf" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={les} className="bg-black text-white px-3 py-2 rounded">Les og utfyll</button>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Beløp" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagre} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre i regnskap
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
