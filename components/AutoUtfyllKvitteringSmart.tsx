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
  const [tittelKandidater, setTittelKandidater] = useState<string[]>([]);
  const [belopKandidater, setBelopKandidater] = useState<string[]>([]);
  const [datoKandidater, setDatoKandidater] = useState<string[]>([]);
  const [valutaKandidater, setValutaKandidater] = useState<string[]>([]);

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
    const typedarray = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
    const side = await pdf.getPage(1);
    const scale = 3;
    const viewport = side.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await side.render({ canvasContext: context, viewport }).promise;
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

  const tolkTekstSmart = (tekst: string) => {
    const linjer = tekst.toLowerCase().split("\n").map((l) => l.trim()).filter(Boolean);

    const tittelKandidater = linjer.filter(
      (l) =>
        (l.includes("frilansportalen") || l.includes("domene") || l.includes("as") || l.includes("faktura")) &&
        !l.includes("status") &&
        !l.includes("kopi") &&
        !l.includes("last ned")
    );

    const belopKandidater = linjer
      .filter((l) =>
        /(kr|beløp|sum|total|å betale|faktura|inkl)/.test(l) &&
        /[0-9]+[.,\s][0-9]{2}/.test(l) &&
        !/(konto|kid|iban)/.test(l)
      )
      .flatMap((l) => {
        const matches = [...l.matchAll(/([0-9\s]+[.,][0-9]{2})/g)];
        return matches.map((m) => m[1]
          .replace(/\s/g, "")
          .replace(",", ".")
          .replace("-,", "")
        );
      })
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v) && v > 0)
      .sort((a, b) => b - a)
      .map((v) => v.toFixed(2));

    const datoKandidater = linjer
      .filter((l) => /(fakturadato|forfallsdato|dato)/.test(l) && /\d{2}[./-]\d{2}[./-]\d{4}/.test(l))
      .map((l) => l.match(/(\d{2}[./-]\d{2}[./-]\d{4})/)?.[1] || "")
      .filter(Boolean);

    const valutaKandidater = linjer
      .filter((l) => /(nok|eur|usd)/.test(l))
      .map((l) => l.match(/(nok|eur|usd)/i)?.[1]?.toUpperCase() || "")
      .filter(Boolean);

    return {
      tittelKandidater,
      belopKandidater,
      datoKandidater,
      valutaKandidater,
    };
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering...");
    let canvas: HTMLCanvasElement;
    if (fil.type === "application/pdf") {
      canvas = await pdfTilBilde(fil);
    } else {
      canvas = await bildeTilCanvas(fil);
    }
    const result = await Tesseract.recognize(canvas, "nor", {
      logger: (m) => console.log("[OCR]", m),
    });
    const tekst = (result as any)?.data?.text || "";
    setTekst(tekst);
    console.log("OCR-tekst:", tekst);

    const { tittelKandidater, belopKandidater, datoKandidater, valutaKandidater } = tolkTekstSmart(tekst);

    setTittelKandidater(tittelKandidater);
    setBelopKandidater(belopKandidater);
    setDatoKandidater(datoKandidater);
    setValutaKandidater(valutaKandidater);

    setTittel(tittelKandidater[0] || "");
    setBelop(belopKandidater[0] || "");
    setDato(datoKandidater[0] || "");
    setValuta(valutaKandidater[0] || "NOK");

    setStatus("Utfylt. Klar til lagring.");
  };

  const lagreKvittering = async () => {
    if (!fil) return;
    const safeFilename = `${Date.now()}-${fil.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "")}`;
    const folder = rolle === "admin" ? "admin" : "bruker";
    const tabell = rolle === "admin" ? "admin_utgifter" : "bruker_utgifter";
    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(`${folder}/kvitteringer/${safeFilename}`, fil, { upsert: true });
    if (uploadError) {
      setStatus("Feil ved opplasting.");
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
    if (error) setStatus("Feil ved lagring.");
    else setStatus("Kvittering lagret!");
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Smart kvitteringsopplasting</h2>
      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les og utfyll</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">
        {tekst || "Ingen tekst hentet fra kvittering ennå."}
      </pre>

      <div className="space-y-2">
        {tittelKandidater.length > 1 ? (
          <select value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded">
            {tittelKandidater.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        )}

        {belopKandidater.length > 1 ? (
          <select value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded">
            {belopKandidater.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input type="text" placeholder="Beløp" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        )}

        {valutaKandidater.length > 1 ? (
          <select value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded">
            {valutaKandidater.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        )}

        {datoKandidater.length > 1 ? (
          <select value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded">
            {datoKandidater.map((v, i) => (
              <option key={i} value={v}>{v}</option>
            ))}
          </select>
        ) : (
          <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
        )}
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>
      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
