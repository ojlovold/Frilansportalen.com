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

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    const kandidater: number[] = [];
    for (const linje of linjer) {
      if (/(total|sum|bel\u00f8p|betalt|amount paid)/.test(linje) && /(kr|\$|eur|usd|nok)/.test(linje) && !linje.includes("mva")) {
        const tall = finnAlleTall(linje);
        kandidater.push(...tall);
      }
    }
    const h\u00f8yeste = Math.max(...kandidater, 0);
    return h\u00f8yeste > 0 ? h\u00f8yeste.toFixed(2) : "";
  };

  const finnValuta = (tekst: string): string => {
    const lower = tekst.toLowerCase();
    if (lower.includes("usd") || lower.includes("$")) return "USD";
    if (lower.includes("eur")) return "EUR";
    return "NOK";
  };

  const parseDato = (tekst: string): string => {
    const regexer = [
      /\b(\d{2})[./-](\d{2})[./-](\d{2,4})\b/,
      /\b(\d{2})[./-](\d{2,4})[./-](\d{2})\b/,
      /\b(\d{4})[./-](\d{2})[./-](\d{2})\b/,
      /\b(\d{2})[./-](\d{2})[./-](\d{4})\b/,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i,
    ];
    for (const r of regexer) {
      const match = tekst.match(r);
      if (match && match.length === 4) {
        let [_, d1, d2, d3] = match;
        if (r.source.includes("jan")) {
          const m\u00e5nedMap: { [key: string]: string } = {
            jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
            jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
          };
          const m\u00e5ned = m\u00e5nedMap[d1.slice(0, 3).toLowerCase()] || "";
          return `${d2.padStart(2, "0")}.${m\u00e5ned}.${d3}`;
        }
        if (d3.length === 2) d3 = "20" + d3;
        return `${d1.padStart(2, "0")}.${d2.padStart(2, "0")}.${d3}`;
      }
    }
    return "";
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

      const datoen = parseDato(text);
      const valuta = finnValuta(text);
      const belopBase = finnTotalbelop(text);
      setDato(datoen);
      setValuta(valuta);
      setBelopOriginal(belopBase);

      if (valuta === "NOK" || valuta === "") {
        setBelop(belopBase);
      } else {
        const kurs = await hentKurs(valuta, "NOK", datoen || "2024-01-01");
        const omregnet = parseFloat(belopBase) * kurs;
        setBelop(omregnet.toFixed(2));
      }

      setStatus("Tekst hentet og tolket fullstendig.");
    } catch (error) {
      setStatus("Kunne ikke lese kvittering. Pr\u00f8v igjen.");
    }
  };

  const lagreKvittering = async () => {
    try {
      if (!fil || !belop || !dato) {
        setStatus("Manglende data. Fyll inn bel\u00f8p og dato.");
        return;
      }

      if (!user?.id) {
        setStatus("Ingen bruker funnet. Logg inn p\u00e5 nytt.");
        return;
      }

      const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
      const folder = rolle === "admin" ? "admin" : "bruker";
      const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";

      const { data: uploadData, error: uploadError } = await supabase.storage
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
          bruker_id: user.id,
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
        <input type="text" placeholder="Originalt bel\u00f8p" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
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
