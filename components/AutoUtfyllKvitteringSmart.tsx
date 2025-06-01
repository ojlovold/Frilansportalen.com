// RETTET: Bruker alltid historisk valutakurs, og foreslår ikke tittel automatisk

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

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
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (fil) lesKvittering();
  }, [fil]);

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

  const parseDato = (tekst: string): string => {
    const norsk = tekst.match(/\b(\d{2})[./-](\d{2})[./-](\d{4})\b/);
    if (norsk) return `${norsk[1]}.${norsk[2]}.${norsk[3]}`;
    const engelsk = tekst.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[ .,\-]+(\d{1,2})(?:st|nd|rd|th)?[., ]+(\d{4})/i);
    if (engelsk) return `${engelsk[1].padStart(2, "0")}.05.${engelsk[2]}`;
    return "";
  };

  const finnValuta = (tekst: string): string => {
    if (tekst.includes("$") || /\bUSD\b/.test(tekst)) return "USD";
    if (tekst.includes("€") || /\bEUR\b/.test(tekst)) return "EUR";
    if (tekst.includes("kr") || /\bNOK\b/.test(tekst)) return "NOK";
    const match = tekst.match(/\b[A-Z]{3}\b/);
    return match ? match[0] : "NOK";
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    for (const linje of linjer) {
      if (/vercel|http|visit|help|page|referanse|id|\d{4}-\d{4}/.test(linje)) continue;
      if (/(amount paid|total|sum|beløp|betalt)/.test(linje)) {
        const match = linje.match(/([$€£]?\s*\d+[\d.,]*)/);
        if (match) {
          const tall = match[0].replace(/[^\d.,]/g, "").replace(/,/g, ".").replace(/\.(?=\d{3})/g, "").trim();
          const val = parseFloat(tall);
          if (!isNaN(val) && val > 0 && val < 10000) return val.toFixed(2);
        }
      }
    }
    return "";
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering...");
    const canvas = fil.type === "application/pdf"
      ? await pdfTilBilde(fil)
      : await bildeTilCanvas(fil);
    const text = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} }).then((r) => r.data.text || "");
    setTekst(text);

    const datoen = parseDato(text);
    const valutaFunnet = finnValuta(text);
    const belopBase = finnTotalbelop(text);

    if (!belopBase) return setStatus("Fant ingen beløp i dokumentet");

    setDato(datoen);
    setValuta(valutaFunnet);
    setBelopOriginal(belopBase);

    if (valutaFunnet === "NOK" || valutaFunnet === "" || !datoen) {
      setBelop(belopBase);
    } else {
      const kurs = await hentKurs(valutaFunnet, "NOK", datoen);
      const omregnet = parseFloat(belopBase) * kurs;
      setBelop(omregnet.toFixed(2));
    }

    setStatus("Ferdig");
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

  const bildeTilCanvas = async (fil: File): Promise<HTMLCanvasElement> => {
    return await new Promise((resolve) => {
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
  };

  const hentKurs = async (fra: string, til: string, dato: string): Promise<number> => {
    const iso = dato.split(".").reverse().join("-");
    if (!iso.match(/^\d{4}-\d{2}-\d{2}$/)) return 0;
    const res = await fetch(`https://api.frankfurter.app/${iso}?from=${fra}&to=${til}`);
    const data = await res.json();
    return data.rates?.[til] || 0;
  };

  const lagreKvittering = async () => {
    if (!user?.id) return setStatus("Du er ikke innlogget");
    if (!fil) return setStatus("Mangler fil");
    if (!belop || isNaN(parseFloat(belop))) return setStatus("Mangler beløp");
    if (!dato.match(/^\d{2}\.\d{2}\.\d{4}$/)) return setStatus("Ugyldig dato");

    const datoISO = dato.split(".").reverse().join("-");
    setStatus("Lagrer...");
    const filnavn = `${user.id}-${Date.now()}-${fil.name.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(`bruker/kvitteringer/${filnavn}`, fil, {
        upsert: true,
        metadata: { tittel, valuta, dato: datoISO },
      });

    if (uploadError) return setStatus("Feil ved opplasting: " + uploadError.message);

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(`bruker/kvitteringer/${filnavn}`);

    const { error: insertError } = await supabase.from("kvitteringer").insert([
      {
        bruker_id: user.id,
        tittel,
        belop: parseFloat(belop),
        valuta,
        dato: datoISO,
        fil_url: urlData?.publicUrl || null,
        opprettet: new Date().toISOString(),
        slettet: false,
      },
    ]);

    if (insertError) {
      await supabase.storage.from("kvitteringer").remove([`bruker/kvitteringer/${filnavn}`]);
      setStatus("Feil: " + JSON.stringify(insertError, null, 2));
    } else {
      setStatus("Kvittering lagret!");
    }
  };

  return (
    <div className="bg-yellow-100 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-5">
      <h2 className="text-2xl font-bold text-gray-800">Autoutfyll kvittering</h2>
      <input
        type="file"
        accept=".pdf,image/*"
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
      />
      <pre className="bg-gray-50 p-3 text-sm rounded-xl whitespace-pre-wrap text-gray-600">
        {tekst || "Ingen tekst funnet."}
      </pre>
      <div className="grid grid-cols-1 gap-3">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="p-3 border rounded-xl" />
        <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="p-3 border rounded-xl bg-gray-100" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="p-3 border rounded-xl" />
        <input type="text" placeholder="Omregnet til NOK" value={belop} onChange={(e) => setBelop(e.target.value)} className="p-3 border rounded-xl" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="p-3 border rounded-xl" />
      </div>
      <button onClick={lagreKvittering} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl w-full">
        Lagre kvittering
      </button>
      <Link href="/kvitteringer" className="block">
        <button className="bg-black hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-xl w-full">
          Se mine kvitteringer
        </button>
      </Link>
      {status && <p className="text-sm text-gray-700 text-center">{status}</p>}
    </div>
  );
}
