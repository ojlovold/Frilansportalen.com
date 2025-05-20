import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { v4 as uuidv4 } from "uuid";

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

  const pdfTilBilde = async (pdfFile: File): Promise<HTMLCanvasElement> => {
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const scale = 4;
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

  const kjørOCR = async (input: HTMLCanvasElement): Promise<string> => {
    const forsøk = async (lang: string) => {
      const result = await Tesseract.recognize(input, lang, { logger: () => {} });
      return (result as any)?.data?.text || "";
    };

    let text = await forsøk("nor+eng");
    if (text.trim().length < 10) {
      text = await forsøk("osd+eng+nor");
    }

    return text;
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    for (let i = linjer.length - 1; i >= 0; i--) {
      const linje = linjer[i];
      if (linje.includes("total") && linje.includes("kr")) {
        const match = linje.match(/kr\s*([0-9\s.,]+)/);
        if (match) {
          return match[1]
            .replace(/[^0-9,]/g, "")
            .replace(/\./g, "")
            .replace(/\s/g, "")
            .replace(",", ".")
            .trim();
        }
      }
    }
    return "";
  };

  const finnDato = (tekst: string): string => {
    const regexDato = /(\d{2}\.\d{2}\.\d{4})/g;
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    for (const linje of linjer) {
      if (linje.includes("forfallsdato") || linje.includes("dato") || linje.includes("faktura")) {
        const datoMatch = linje.match(regexDato);
        if (datoMatch && datoMatch.length > 0) {
          return datoMatch[0];
        }
      }
    }
    return "";
  };

  const finnTittel = (tekst: string): string => {
    const linjer = tekst.split("\n");
    for (const linje of linjer) {
      if (linje.toLowerCase().includes("beskrivelse") || linje.toLowerCase().includes("referanse")) {
        return linje.trim();
      }
    }
    return linjer[0]?.trim() || "";
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering...");
    let canvas;
    try {
      if (fil.type === "application/pdf") {
        canvas = await pdfTilBilde(fil);
      } else {
        canvas = await bildeTilCanvas(fil);
      }
      const text = await kjørOCR(canvas);
      setTekst(text);
      setBelop(finnTotalbelop(text));
      setDato(finnDato(text));
      setTittel(finnTittel(text));
      setStatus("Tekst hentet. Fyll inn eller rediger manuelt.");
    } catch (err) {
      setStatus("Kunne ikke lese kvittering. Sjekk filtype eller kontrast.");
      console.error(err);
    }
  };

  const lagreKvittering = async () => {
    if (!fil || !tittel || !belop || !valuta || !dato) {
      setStatus("Fyll ut alle feltene og velg fil.");
      return;
    }

    setStatus("Lagrer kvittering...");

    const filnavn = `${uuidv4()}_${fil.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(filnavn, fil);

    if (uploadError) {
      console.error(uploadError);
      setStatus("Kunne ikke laste opp filen.");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(filnavn);
    const fil_url = urlData?.publicUrl || "";

    const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";
    const { error } = await supabase.from(tabell).insert([
      {
        tittel,
        belop: parseFloat(belop),
        valuta,
        dato,
        tekst,
        fil_url,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("Feil ved lagring: " + error.message);
    } else {
      setStatus("Kvittering lagret.");
      setTittel("");
      setBelop("");
      setDato("");
      setTekst("");
      setFil(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Kvitteringsopplasting (presisjon)</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">
        {tekst || "Ingen tekst funnet."}
      </pre>

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
