import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AutoUtfyllBrukerKvittering() {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const typedarray = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    const side = await pdf.getPage(1);

    const scale = 2;
    const viewport = side.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await side.render({ canvasContext: context, viewport }).promise;
    return canvas;
  };

  const lesKvittering = async () => {
    if (!fil) return;

    setStatus("Leser tekst på kvitteringen...");

    let kilde: any = fil;
    if (fil.type === "application/pdf") {
      const canvas = await pdfTilBilde(fil);
      kilde = canvas;
    }

    const result = await Tesseract.recognize(kilde, "nor", {
      logger: (m) => console.log(m),
    });

    const tekst = (result as any)?.data?.text || "";
    setTekst(tekst);
    setStatus("Tolker tekst...");

    const belopMatch = tekst.match(/([0-9]+[,.][0-9]{2})\s*(kr|NOK|EUR|USD)?/i);
    const datoMatch = tekst.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);
    const tittelMatch = tekst.split("\n").find((l: string) => l.length > 4);

    setBelop(belopMatch?.[1]?.replace(",", ".") || "");
    setValuta(belopMatch?.[2]?.toUpperCase() || "NOK");
    setDato(datoMatch?.[1] || "");
    setTittel(tittelMatch?.trim() || "");
    setStatus("Utfylt. Klar til innsending.");
  };

  const lagreKvittering = async () => {
    if (!fil) return;

    const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(`bruker/kvitteringer/${safeFilename}`, fil, { upsert: true });

    if (uploadError) {
      setStatus("Feil ved opplasting.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("dokumenter")
      .getPublicUrl(`bruker/kvitteringer/${safeFilename}`);

    const { error } = await supabase.from("bruker_utgifter").insert([
      {
        tittel,
        belop: parseFloat(belop),
        valuta,
        dato,
        fil_url: urlData?.publicUrl || null,
      },
    ]);

    if (error) setStatus("Feil ved lagring.");
    else setStatus("Kvittering lagret!");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Last opp kvittering (bruker)</h2>

      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les og utfyll</button>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Beløp" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre i mine utgifter
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
