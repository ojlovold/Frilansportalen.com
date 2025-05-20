import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/webpack";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const hentDatoer = (tekst: string): string[] => {
    const regex = /\b(\d{2}[./-]\d{2}[./-]\d{2,4})\b/g;
    const kandidater = Array.from(tekst.matchAll(regex)).map((m) => m[1].replace(/[/-]/g, "."));
    return Array.from(new Set(kandidater.filter((dato) => {
      const deler = dato.split(".").map(Number);
      if (deler.length !== 3) return false;
      const [dd, mm, yyyy] = deler;
      return dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12 && yyyy >= 1900;
    })));
  };

  const hentBelop = (tekst: string): string[] => {
    const linjer = tekst.toLowerCase().split("\n");
    const belopRegex = /(?:kr|nok|usd|eur|\$|\u20ac)?\s*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2})?)/gi;
    const funn = linjer.flatMap((linje) =>
      /(kr|beløp|total|sum|mva)/.test(linje)
        ? Array.from(linje.matchAll(belopRegex)).map((m) =>
            m[1].replace(/[^0-9,\.]/g, "").replace(/\./g, "").replace(",", ".").trim()
          )
        : []
    );
    return Array.from(
      new Set(
        funn
          .map((b) => parseFloat(b))
          .filter((n) => n > 0 && n < 10000000)
          .map((n) => n.toFixed(2))
      )
    );
  };

  const parseDato = (datoStr: string) => {
    const parts = datoStr.split(".");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return datoStr;
  };

  const lesKvittering = async () => {
    if (!fil) return setStatus("Ingen fil valgt.");
    setStatus("Leser kvittering …");
    const canvas = fil.type === "application/pdf"
      ? await pdfTilCanvas(fil)
      : await bildeTilCanvas(fil);
    if (!canvas) return setStatus("Kunne ikke generere bilde fra fil.");
    const tekst = await kjørOCR(canvas);
    if (!tekst || tekst.length < 5) return setStatus("Ingen lesbar tekst funnet.");
    setTekst(tekst);
    setTittel(tekst.split("\n")[0]?.trim() || "");
    const datoer = hentDatoer(tekst);
    setDatoListe(datoer);
    if (datoer.length === 1) setDato(datoer[0]);
    const belop = hentBelop(tekst);
    setBelopListe(belop);
    if (belop.length === 1) setBelop(belop[0]);
    setStatus("Tekst hentet. Velg riktige verdier eller rediger.");
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

    const payload: any = {
      tittel,
      belop: parseFloat(belop),
      valuta,
      dato: parseDato(dato),
      tekst,
      fil_url,
    };
    if (rolle === "bruker") payload.bruker_id = bruker_id;

    // Valutaomregning til NOK
    if (valuta !== "NOK") {
      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${valuta}&symbols=NOK`);
        const data = await res.json();
        if (data?.rates?.NOK) {
          payload.belop = (payload.belop * data.rates.NOK).toFixed(2);
          payload.valuta = "NOK";
        }
      } catch {
        console.warn("Valutaomregning feilet");
      }
    }

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
        {belopListe.length > 1 ? (
          <select value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Velg beløp</option>
            {belopListe.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        ) : (
          <input value={belop} onChange={(e) => setBelop(e.target.value)} placeholder="Beløp" className="w-full p-2 border rounded" />
        )}
        <input value={valuta} onChange={(e) => setValuta(e.target.value.toUpperCase())} placeholder="Valuta" className="w-full p-2 border rounded" />
        {datoListe.length > 1 ? (
          <select value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Velg dato</option>
            {datoListe.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        ) : (
          <input value={dato} onChange={(e) => setDato(e.target.value)} placeholder="Dato (dd.mm.yyyy)" className="w-full p-2 border rounded" />
        )}
      </div>
      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">Lagre kvittering</button>
      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
