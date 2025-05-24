// components/AutoUtfyllKvitteringSmart.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const scale = 3;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const bildeTilCanvas = async (fil: File): Promise<HTMLCanvasElement> => {
    return await new Promise((resolve) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(fil);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        forbedreKontrast(canvas);
        resolve(canvas);
      };
    });
  };

  const hentKurs = async (fra: string, til: string, dato: string): Promise<number> => {
    const rensetDato = dato.split(".").reverse().join("-");
    const res = await fetch(`https://api.frankfurter.app/${rensetDato}?from=${fra}&to=${til}`);
    const data = await res.json();
    return data.rates?.[til] || 0;
  };

  const finnAlleTall = (linje: string): number[] => {
    const matches = [...linje.matchAll(/\d[\d.,]+/g)];
    return matches
      .map((m) => m[0].replace(/,/g, ".").replace(/\.(?=\d{3})/g, "").trim())
      .map((str) => parseFloat(str))
      .filter((val) => !isNaN(val) && val > 0);
  };

  const parseDato = (tekst: string): string => {
    const regexer = [
      /\b(\d{4})[-./](\d{2})[-./](\d{2})\b/,
      /\b(\d{2})[-./](\d{2})[-./](\d{4})\b/,
      /\b(\d{2})[-./](\d{2})[-./](\d{2})\b/,
      /\b(\d{2})[-./](\d{2})[-./](\d{4})\b/,
      /\b(\d{2})[ ]?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[ ]?(\d{2,4})/i,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[ ]?(\d{1,2})[a-z]{0,2},?[ ]?(\d{4})/i,
      /\b(\d{8})\b/,
    ];

    for (const r of regexer) {
      const match = tekst.match(r);
      if (!match) continue;

      if (match.length === 4 && match[1].length === 4) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      } else if (match.length === 4 && match[3].length === 4) {
        return `${match[3]}-${match[2]}-${match[1]}`;
      } else if (match.length === 4 && isNaN(Number(match[2]))) {
        const månedMap: { [key: string]: string } = {
          jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
          jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
        };
        const d = match[2].padStart(2, "0");
        const m = månedMap[match[1].toLowerCase().slice(0, 3)] || "01";
        return `${match[3]}-${m}-${d}`;
      } else if (match.length === 2 && match[1].length === 8) {
        const str = match[1];
        return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6)}`;
      }
    }
    return "";
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    const kandidater: number[] = [];
    for (const linje of linjer) {
      if (/(total|sum|beløp|betalt|amount paid)/.test(linje) && /(kr|\$|eur|usd|nok)/.test(linje) && !linje.includes("mva")) {
        const tall = finnAlleTall(linje);
        kandidater.push(...tall);
      }
    }
    const høyeste = Math.max(...kandidater, 0);
    return høyeste > 0 ? høyeste.toFixed(2) : "";
  };

  const finnValuta = (tekst: string): string => {
    const lower = tekst.toLowerCase();
    if (lower.includes("usd") || lower.includes("$")) return "USD";
    if (lower.includes("eur")) return "EUR";
    return "NOK";
  };

  const lesKvittering = async () => {
    try {
      if (!fil) return;
      setStatus("Leser kvittering...");
      let canvas;
      if (fil.type === "application/pdf") {
        canvas = await pdfTilBilde(fil);
      } else {
        canvas = await bildeTilCanvas(fil);
      }
      const text = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} }).then((r: any) => r.data.text || "");
      setTekst(text);

      const isoDato = parseDato(text);
      const valuta = finnValuta(text);
      const belopBase = finnTotalbelop(text);

      setDato(isoDato);
      setValuta(valuta);
      setBelopOriginal(belopBase);

      if (valuta === "NOK" || valuta === "") {
        setBelop(belopBase);
      } else {
        const kurs = await hentKurs(valuta, "NOK", isoDato || "2024-01-01");
        const omregnet = parseFloat(belopBase) * kurs;
        setBelop(omregnet.toFixed(2));
      }

      setStatus("Tekst hentet og tolket fullstendig.");
    } catch (error) {
      setStatus("Kunne ikke lese kvittering. Prøv igjen.");
    }
  };

  const lagreKvittering = async () => {
    try {
      if (!fil || !belop || !dato) {
        setStatus("Manglende data. Fyll inn beløp og dato.");
        return;
      }

      const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
      const folder = rolle === "admin" ? "admin" : "bruker";
      const tabell = "kvitteringer";

      const { error: uploadError } = await supabase.storage
        .from("dokumenter")
        .upload(`${folder}/kvitteringer/${safeFilename}`, fil, { upsert: true });

      if (uploadError) {
        console.error("Opplasting feilet:", uploadError.message);
        setStatus(`Opplasting feilet: ${uploadError.message}`);
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

      if (error) setStatus("Feil ved lagring til database.");
      else setStatus("Kvittering lagret!");
    } catch (err) {
      console.error("Uventet feil:", err);
      setStatus("Uventet feil ved lagring.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting (Rolls)</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">
        {tekst || "Ingen tekst funnet."}
      </pre>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Omregnet til NOK" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (YYYY-MM-DD)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
