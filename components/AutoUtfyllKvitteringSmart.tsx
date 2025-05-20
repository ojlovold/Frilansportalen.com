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

type KvitteringsTolkning = {
  belop: string;
  valuta: string;
  dato: string;
  originalLinje: string;
};

function tolkKvitteringsdataFraTekst(tekst: string): KvitteringsTolkning | null {
  const linjer = tekst.toLowerCase().split("\n");

  const valutaRegex = /(kr|nok|\$|usd|eur|€)/i;
  const belopRegex = /([0-9\s.,\-–]+)/;
  const datoRegex = /\b(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})\b/;
  const ignorert = /(faktura|kid|org\.?|kundenummer|iban|swift|konto|referanse|nummer)/;

  let valgt: { belop: string; valuta: string; linje: string } | null = null;

  for (const linje of linjer) {
    console.log("VURDERER:", linje);
    if (!valutaRegex.test(linje)) continue;
    if (ignorert.test(linje)) continue;
    if (!/(total|sum|amount|beløp|subtotal|å betale|paid)/.test(linje) && !valutaRegex.test(linje)) continue;

    const valutaMatch = linje.match(valutaRegex);
    const belopMatch = linje.match(belopRegex);

    if (valutaMatch && belopMatch) {
      let raw = belopMatch[1]
        .replace(/[^\d.,]/g, "")
        .replace(/\.(?=\d{3})/g, "")
        .replace(",", ".")
        .replace(/\.{2,}/g, ".")
        .trim();
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
        valgt = {
          belop: parsed.toFixed(2),
          valuta: valutaMatch[1].toUpperCase().replace("KR", "NOK").replace("€", "EUR"),
          linje,
        };
        console.log("VALGT LINJE:", valgt);
      }
    }
  }

  const datoMatch = tekst.match(datoRegex);
  const dato = datoMatch
    ? `${datoMatch[3].length === 2 ? "20" + datoMatch[3] : datoMatch[3]}-${datoMatch[2].padStart(2, "0")}-${datoMatch[1].padStart(2, "0")}`
    : new Date().toISOString().slice(0, 10);

  if (!valgt) return null;

  return {
    belop: valgt.belop,
    valuta: valgt.valuta,
    dato,
    originalLinje: valgt.linje,
  };
}

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [dato, setDato] = useState("");
  const [status, setStatus] = useState("");

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      const high = brightness > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = high;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const pdfTilCanvas = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const bildeTilCanvas = async (file: File) =>
    new Promise<HTMLCanvasElement>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        forbedreKontrast(canvas);
        resolve(canvas);
      };
    });

  const kjørOCR = async (canvas: HTMLCanvasElement) => {
    const forsøk = async (lang: string) => (await Tesseract.recognize(canvas, lang)).data.text || "";
    let tekst = await forsøk("nor+eng");
    if (tekst.trim().length < 10) tekst = await forsøk("osd+eng+nor");
    return tekst;
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering …");
    const canvas = fil.type === "application/pdf"
      ? await pdfTilCanvas(fil)
      : await bildeTilCanvas(fil);
    const tekst = await kjørOCR(canvas);
    setTekst(tekst);
    setTittel(tekst.split("\n")[0]?.trim() || "");

    const tolkning = tolkKvitteringsdataFraTekst(tekst);
    if (tolkning) {
      setBelop(tolkning.belop);
      setValuta(tolkning.valuta);
      setDato(tolkning.dato);
    }

    setStatus("Tekst hentet. Verdier er automatisk fylt ut.");
  };

  const lagreKvittering = async () => {
    if (!fil || !belop || !dato) return setStatus("Fyll ut alle feltene og velg fil.");
    const filnavn = `${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage.from("kvitteringer").upload(filnavn, fil);
    if (uploadError) return setStatus("Feil ved opplasting av fil.");
    const { data: urlData } = supabase.storage.from("kvitteringer").getPublicUrl(filnavn);
    const fil_url = urlData?.publicUrl || "";
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const bruker_id = userData?.user?.id;
    if (userError || !bruker_id) return setStatus("Klarte ikke hente bruker-ID.");

    let konvertertBelop = parseFloat(belop);
    let endeligValuta = valuta;

    if (valuta !== "NOK") {
      try {
        const res = await fetch(`https://api.exchangerate.host/${dato}?base=${valuta}&symbols=NOK`);
        const data = await res.json();
        if (data?.rates?.NOK) {
          konvertertBelop = parseFloat((konvertertBelop * data.rates.NOK).toFixed(2));
          endeligValuta = "NOK";
        }
      } catch {
        console.warn("Valutaomregning feilet");
      }
    }

    const payload: any = {
      tittel,
      belop: konvertertBelop,
      valuta: endeligValuta,
      dato,
      tekst,
      fil_url,
    };
    if (rolle === "bruker") payload.bruker_id = bruker_id;

    const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";
    const { error } = await supabase.from(tabell).insert([payload]);
    if (error) return setStatus("Feil ved lagring: " + error.message);
    setStatus("Kvittering lagret.");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting (smart)</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>
      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">{tekst || "Ingen tekst funnet."}</pre>
      <div className="space-y-2">
        <input value={tittel} onChange={(e) => setTittel(e.target.value)} placeholder="Tittel" className="w-full p-2 border rounded" />
        <input value={belop} onChange={(e) => setBelop(e.target.value)} placeholder="Beløp" className="w-full p-2 border rounded" />
        <input value={valuta} onChange={(e) => setValuta(e.target.value.toUpperCase())} placeholder="Valuta" className="w-full p-2 border rounded" />
        <input value={dato} onChange={(e) => setDato(e.target.value)} placeholder="Dato (yyyy-mm-dd)" className="w-full p-2 border rounded" />
      </div>
      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">Lagre kvittering</button>
      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
