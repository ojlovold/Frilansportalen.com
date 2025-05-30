/* AutoUtfyllKvitteringSmart.tsx */

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { useRouter } from "next/router";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function AutoUtfyllKvitteringSmart() {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [belopOriginal, setBelopOriginal] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");
  const [visKvitteringerKnapp, setVisKvitteringerKnapp] = useState(true);
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const bruker_id = user?.id;

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
      const high = brightness > 128 ? 255 : 0;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = high;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 3 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const bildeTilCanvas = async (fil: File): Promise<HTMLCanvasElement> =>
    await new Promise((resolve) => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(fil);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        forbedreKontrast(canvas);
        resolve(canvas);
      };
    });

  const parseDato = (tekst: string): string => {
    const match = tekst.match(/(\d{2})[./-](\d{2})[./-](\d{2,4})/);
    if (!match) return "";
    const [_, d, m, y] = match;
    return `${d}.${m}.${y.length === 2 ? "20" + y : y}`;
  };

  const finnValuta = (tekst: string): string => {
    const lower = tekst.toLowerCase();
    if (lower.includes("usd") || lower.includes("$")) return "USD";
    if (lower.includes("eur")) return "EUR";
    return "NOK";
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    const kandidater: number[] = [];
    for (const linje of linjer) {
      if (/(total|sum|beløp|betalt|amount paid)/.test(linje) && /(kr|\$|eur|usd|nok)/.test(linje) && !linje.includes("mva")) {
        const matches = [...linje.matchAll(/\d[\d.,]+/g)];
        const tall = matches
          .map((m) => m[0].replace(/,/g, ".").replace(/\.(?=\d{3})/g, "").trim())
          .map((str) => parseFloat(str))
          .filter((val) => !isNaN(val) && val > 0);
        kandidater.push(...tall);
      }
    }
    const høyeste = Math.max(...kandidater, 0);
    return høyeste > 0 ? høyeste.toFixed(2) : "";
  };

  const hentKurs = async (fra: string, til: string, dato: string): Promise<number> => {
    const iso = dato.split(".").reverse().join("-");
    const res = await fetch(`https://api.frankfurter.app/${iso}?from=${fra}&to=${til}`);
    const data = await res.json();
    return data.rates?.[til] || 0;
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering...");
    const canvas = fil.type === "application/pdf" ? await pdfTilBilde(fil) : await bildeTilCanvas(fil);
    const text = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} }).then((r) => r.data.text || "");
    setTekst(text);
    setDato(parseDato(text));
    const valutaFunnet = finnValuta(text);
    setValuta(valutaFunnet);
    const belopBase = finnTotalbelop(text);
    setBelopOriginal(belopBase);

    if (valutaFunnet === "NOK" || valutaFunnet === "") {
      setBelop(belopBase);
    } else {
      const kurs = await hentKurs(valutaFunnet, "NOK", dato || "2024-01-01");
      const omregnet = parseFloat(belopBase) * kurs;
      setBelop(omregnet.toFixed(2));
    }
  };

  const lagreKvittering = async () => {
    if (!fil) return setStatus("Mangler fil");
    if (!belop || isNaN(parseFloat(belop))) return setStatus("Mangler beløp");
    if (!dato.match(/^\d{2}\.\d{2}\.\d{4}$/)) return setStatus("Ugyldig dato");
    const datoISO = dato.split(".").reverse().join("-");
    setStatus("Lagrer...");
    const filnavn = `${Date.now()}-${fil.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage.from("kvitteringer").upload(`bruker/kvitteringer/${filnavn}`, fil, { upsert: true });
    if (uploadError) return setStatus("Feil ved opplasting: " + uploadError.message);
    const { data: urlData } = supabase.storage.from("kvitteringer").getPublicUrl(`bruker/kvitteringer/${filnavn}`);
    const { error: insertError } = await supabase.from("kvitteringer").insert([
      {
        bruker_id,
        tittel: tittel.trim() || "Kvittering",
        belop: parseFloat(belop),
        valuta,
        dato: datoISO,
        fil_url: urlData?.publicUrl || null,
        opprettet: new Date().toISOString(),
      },
    ]);
    if (insertError) return setStatus("Feil ved lagring");
    setStatus("Kvittering lagret!");
  };

  return (
    <div className="bg-portalGul min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Autoutfyll kvittering</h2>
        <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} className="mb-3" />
        <button onClick={lesKvittering} className="bg-black text-white px-4 py-2 rounded w-full mb-4">
          Les kvittering
        </button>
        <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded mb-4">{tekst || "Ingen tekst funnet."}</pre>
        <div className="space-y-3">
          <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
          <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Omregnet til NOK" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button onClick={lagreKvittering} className="bg-green-600 text-white px-4 py-2 rounded w-full mt-4">
          Lagre kvittering
        </button>
        {status && <p className="text-sm text-gray-700 mt-3">{status}</p>}

        <button
          onClick={() => router.push("/kvitteringer")}
          className="bg-portalGrå text-white mt-6 px-4 py-2 rounded text-center w-full shadow hover:opacity-90"
        >
          Se mine kvitteringer
        </button>
      </div>
    </div>
  );
}
