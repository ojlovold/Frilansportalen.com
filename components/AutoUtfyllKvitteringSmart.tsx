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
  const [belopListe, setBelopListe] = useState<string[]>([]);
  const [valuta, setValuta] = useState("NOK");
  const [dato, setDato] = useState("");
  const [datoListe, setDatoListe] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  const forbedreKontrast = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = 0.34 * r + 0.5 * g + 0.16 * b;
      const inverted = 255 - brightness;
      const high = inverted > 128 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = high;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  const pdfTilCanvas = async (file: File) => {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    forbedreKontrast(canvas);
    return canvas;
  };

  const bildeTilCanvas = async (file: File) => new Promise<HTMLCanvasElement>((resolve) => {
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

  const hentBelop = (tekst: string): string[] => {
    const regex = /(?:kr|nok|usd|eur|\$|\u20ac)?\s*([0-9]+[\.,]?[0-9]{0,2})/gi;
    const funn = [...tekst.matchAll(regex)].map(m => m[1].replace(/\s/g, "").replace(",", "."));
    return Array.from(new Set(funn));
  };

  const hentDatoer = (tekst: string): string[] => {
    const regex = /(\d{2}[./-]\d{2}[./-]\d{4})/g;
    const funn = [...tekst.matchAll(regex)].map(m => m[1].replace(/[/-]/g, "."));
    return Array.from(new Set(funn));
  };

  const konverterTilNOK = async (verdi: string, valuta: string) => {
    if (valuta.toUpperCase() === "NOK") return verdi;
    try {
      const res = await fetch(`https://api.exchangerate.host/convert?from=${valuta}&to=NOK&amount=${verdi}`);
      const data = await res.json();
      return data.result?.toFixed(2) || verdi;
    } catch {
      return verdi;
    }
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering …");
    let canvas = fil.type === "application/pdf" ? await pdfTilCanvas(fil) : await bildeTilCanvas(fil);
    const tekst = await kjørOCR(canvas);
    setTekst(tekst);
    const belopene = hentBelop(tekst);
    const datoene = hentDatoer(tekst);
    setBelopListe(belopene);
    setDatoListe(datoene);
    if (belopene.length === 1) setBelop(belopene[0]);
    if (datoene.length === 1) setDato(datoene[0]);
    setTittel(tekst.split("\n")[0]?.trim() || "");
    setStatus("Tekst hentet. Velg riktige verdier eller rediger.");
  };

  const lagreKvittering = async () => {
    if (!fil || !belop || !dato) {
      setStatus("Fyll ut alle feltene og velg fil.");
      return;
    }
    setStatus("Lagrer …");
    const filnavn = `${Date.now()}_${fil.name}`;
    const { error: upErr } = await supabase.storage.from("kvitteringer").upload(filnavn, fil);
    if (upErr) return setStatus("Feil ved opplasting");

    const { data: urlData } = supabase.storage.from("kvitteringer").getPublicUrl(filnavn);
    const fil_url = urlData?.publicUrl || "";
    const belopNOK = await konverterTilNOK(belop, valuta);
    const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";
    const payload: any = {
      tittel,
      belop: parseFloat(belopNOK),
      valuta,
      dato,
      tekst,
      fil_url,
    };
    if (rolle === "bruker") {
      const { data: auth } = await supabase.auth.getUser();
      payload.bruker_id = auth?.user?.id;
    }
    const { error } = await supabase.from(tabell).insert([payload]);
    setStatus(error ? "Feil ved lagring." : "Kvittering lagret.");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting (intelligent)</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">{tekst || "Ingen tekst funnet."}</pre>

      <div className="space-y-2">
        <input value={tittel} onChange={(e) => setTittel(e.target.value)} placeholder="Tittel" className="w-full p-2 border rounded" />

        {belopListe.length > 1 && (
          <select onChange={(e) => setBelop(e.target.value)} value={belop} className="w-full p-2 border rounded">
            <option value="">Velg beløp</option>
            {belopListe.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        )}
        {belopListe.length <= 1 && (
          <input value={belop} onChange={(e) => setBelop(e.target.value)} placeholder="Beløp" className="w-full p-2 border rounded" />
        )}

        <input value={valuta} onChange={(e) => setValuta(e.target.value.toUpperCase())} placeholder="Valuta" className="w-full p-2 border rounded" />

        {datoListe.length > 1 && (
          <select onChange={(e) => setDato(e.target.value)} value={dato} className="w-full p-2 border rounded">
            <option value="">Velg dato</option>
            {datoListe.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        )}
        {datoListe.length <= 1 && (
          <input value={dato} onChange={(e) => setDato(e.target.value)} placeholder="Dato (dd.mm.yyyy)" className="w-full p-2 border rounded" />
        )}
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
