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

export default function AutoUtfyllKvitteringUltimate({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      const contrast = avg > 128 ? 255 : 0;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = contrast;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const typedarray = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    const side = await pdf.getPage(1);
    const scale = 3;
    const viewport = side.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await side.render({ canvasContext: context, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const kjørOCR = async (input: any): Promise<string> => {
    const result = await Tesseract.recognize(input, "nor", {
      logger: (m) => console.log("[OCR]", m),
    });
    return (result as any)?.data?.text || "";
  };

  const lesKvittering = async () => {
    if (!fil) return;

    setStatus("Analyserer kvittering...");
    let canvas: any = null;
    let tekst = "";

    if (fil.type === "application/pdf") {
      canvas = await pdfTilBilde(fil);
      tekst = await kjørOCR(canvas);
    } else {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(fil);
      await new Promise((resolve) => (img.onload = resolve));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      forbedreKontrast(canvas);
      tekst = await kjørOCR(canvas);
    }

    setTekst(tekst);
    console.log("Kvitteringstekst:", tekst);
    setStatus("Tolker innhold...");

    const belopMatch = tekst.match(/([0-9\s]+[,.][0-9]{2})\s*(kr|NOK|EUR|USD)?/i);
    const datoMatch = tekst.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);
    const tittelMatch = tekst.split("\n").find((l: string) => l.length > 4);

    setBelop(belopMatch?.[1]?.replace(/\s/g, "").replace(",", ".") || "");
    setValuta(belopMatch?.[2]?.toUpperCase() || "NOK");
    setDato(datoMatch?.[1] || "");
    setTittel(tittelMatch?.trim() || "");
    setStatus("Utfylt. Klar til innsending.");
  };

  const lagreKvittering = async () => {
    if (!fil) return;

    const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
    const folder = rolle === "admin" ? "admin" : "bruker";
    const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";

    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(`${folder}/kvitteringer/${safeFilename}`, fil, { upsert: true });

    if (uploadError) {
      setStatus("Feil ved opplasting.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("dokumenter")
      .getPublicUrl(`${folder}/kvitteringer/${safeFilename}`);

    const { error } = await supabase.from(tabell).insert([
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
      <h2 className="text-xl font-semibold">Last opp kvittering (PDF og bilde støttes)</h2>

      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les og utfyll</button>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Beløp" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
