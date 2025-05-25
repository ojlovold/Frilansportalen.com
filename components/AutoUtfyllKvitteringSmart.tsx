// AutoUtfyllKvitteringSmart.tsx
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const supabase = createBrowserSupabaseClient();

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [belopOriginal, setBelopOriginal] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");

  const user = useUser();

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const r = imgData.data[i];
      const g = imgData.data[i + 1];
      const b = imgData.data[i + 2];
      const brightness = 0.34 * r + 0.5 * g + 0.16 * b;
      const high = brightness > 128 ? 255 : 0;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = high;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const parseDato = (tekst: string): string => {
    const match = tekst.match(/(\d{2})[./-](\d{2})[./-](\d{2,4})/);
    if (!match) return "";
    let [_, dag, mnd, år] = match;
    if (år.length === 2) år = "20" + år;
    return `${dag}.${mnd}.${år}`;
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.toLowerCase().split("\n");
    const kandidater = linjer
      .filter((l) => /(total|sum|betalt|amount paid)/.test(l) && /\d/.test(l))
      .flatMap((linje) => {
        const match = linje.match(/\d+[.,]?\d*/g);
        return match ? match.map((m) => parseFloat(m.replace(",", "."))) : [];
      });
    const høyeste = Math.max(...kandidater, 0);
    return høyeste > 0 ? høyeste.toFixed(2) : "";
  };

  const lesKvittering = async () => {
    try {
      if (!fil) return;
      setStatus("Leser kvittering...");
      const img = document.createElement("img");
      img.src = URL.createObjectURL(fil);
      await new Promise((resolve) => (img.onload = resolve));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      forbedreKontrast(canvas);

      const text = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} }).then((r: any) => r.data.text || "");
      setTekst(text);

      const datoen = parseDato(text);
      const belopBase = finnTotalbelop(text);
      setDato(datoen);
      setBelopOriginal(belopBase);
      setBelop(belopBase);

      setStatus("Tekst hentet og tolket.");
    } catch (err) {
      setStatus("Kunne ikke lese kvittering.");
    }
  };

  const lagreKvittering = async () => {
    if (!user?.id) {
      setStatus("Bruker-ID mangler. Logg inn på nytt.");
      return;
    }
    if (!fil || !belop || !dato) {
      setStatus("Manglende data. Fyll inn beløp og dato.");
      return;
    }

    const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
    const folder = rolle === "admin" ? "admin" : "bruker";
    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(`${folder}/kvitteringer/${safeFilename}`, fil, { upsert: true });

    if (uploadError) {
      setStatus(`Opplasting feilet: ${uploadError.message}`);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("dokumenter")
      .getPublicUrl(`${folder}/kvitteringer/${safeFilename}`);

    const { error } = await supabase.from("kvitteringer").insert([
      {
        bruker_id: user.id,
        tittel,
        belop: parseFloat(belop),
        valuta,
        dato,
        fil_url: urlData?.publicUrl || null,
      },
    ]);

    if (error) setStatus("Feil ved lagring til database.");
    else setStatus("Kvittering lagret!");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      {user?.id && (
        <p className="text-xs text-gray-500">Bruker-ID: {user.id}</p>
      )}

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">
        {tekst || "Ingen tekst funnet."}
      </pre>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Omregnet til NOK" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
