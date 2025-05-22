// components/AutoUtfyllKvitteringSmart.tsx
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

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
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

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    const kandidater: number[] = [];
    for (const linje of linjer) {
      if (/(total|sum|beløp|betalt|amount paid)/.test(linje) && /(kr|\$|eur|usd|nok)/.test(linje) && !linje.includes("mva")) {
        const match = linje.match(/[$kr\s]*([0-9\s.,]+)/);
        if (match) {
          const tall = match[1]
            .replace(/[^0-9.,]/g, "")
            .replace(/,/g, ".")
            .replace(/\s/g, "");
          const verdi = parseFloat(tall);
          if (!isNaN(verdi) && verdi > 100) kandidater.push(verdi);
        }
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

  const finnDato = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    for (const linje of linjer) {
      if (linje.includes("forfallsdato") || linje.includes("paid on") || linje.includes("invoice date")) {
        const match = linje.match(/\d{1,2}[./-]\d{1,2}[./-]\d{4}/);
        if (match) return match[0].replace(/-/g, ".");
      }
    }
    return "";
  };

  const lesKvittering = async () => {
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

    const valuta = finnValuta(text);
    const datoen = finnDato(text);
    const belopBase = finnTotalbelop(text);
    setDato(datoen);
    setValuta(valuta);

    if (valuta === "NOK" || valuta === "") {
      setBelop(belopBase);
    } else {
      const kurs = await hentKurs(valuta, "NOK", datoen || "2024-01-01");
      const omregnet = parseFloat(belopBase) * kurs;
      setBelop(omregnet.toFixed(2));
    }

    setStatus("Tekst hentet og beløp omregnet til NOK.");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting (valuta og alt)</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">
        {tekst || "Ingen tekst funnet."}
      </pre>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Beløp (NOK)" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
