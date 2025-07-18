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

  const erGyldigDato = (dag: number, mnd: number, år: number): boolean => {
    const d = new Date(år, mnd - 1, dag);
    return d.getDate() === dag && d.getMonth() === mnd - 1 && d.getFullYear() === år;
  };

  const erFakturaDato = (linje: string): boolean => {
    const l = linje.toLowerCase();
    return /fakturadato|invoice date|issued/.test(l) && !/forfallsdato|due/.test(l);
  };

  const parseDato = (tekst: string): string => {
    const linjer = tekst.split("\n");

    for (const linje of linjer) {
      if (!erFakturaDato(linje)) continue;

      const norsk = linje.match(/(\d{2})[./-](\d{2})[./-](\d{2,4})/);
      if (norsk) {
        const dag = parseInt(norsk[1]);
        const mnd = parseInt(norsk[2]);
        const år = parseInt(norsk[3].length === 2 ? `20${norsk[3]}` : norsk[3]);
        if (erGyldigDato(dag, mnd, år)) return `${norsk[1]}.${norsk[2]}.${år}`;
      }

      const engelsk = linje.match(/([A-Z][a-z]+) (\d{1,2})(?:,)? (\d{4})/);
      if (engelsk) {
        const dag = parseInt(engelsk[2]);
        const mnd = new Date(`${engelsk[1]} 1, 2000`).getMonth() + 1;
        const år = parseInt(engelsk[3]);
        if (erGyldigDato(dag, mnd, år)) return `${dag.toString().padStart(2, "0")}.${mnd.toString().padStart(2, "0")}.${år}`;
      }
    }

    for (const linje of linjer) {
      const fallback = linje.match(/([A-Z][a-z]+) (\d{1,2})(?:,)? (\d{4})/);
      if (fallback) {
        const dag = parseInt(fallback[2]);
        const mnd = new Date(`${fallback[1]} 1, 2000`).getMonth() + 1;
        const år = parseInt(fallback[3]);
        if (erGyldigDato(dag, mnd, år)) return `${dag.toString().padStart(2, "0")}.${mnd.toString().padStart(2, "0")}.${år}`;
      }
    }

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
    let max = 0;
    for (const linje of linjer) {
      if (/vercel|http|visit|help|page|referanse|id/.test(linje) || /mva|frakt|gebyr|ekspedisjon|rabatt/.test(linje)) continue;
      if (/(total|totalt|sum|beløp|betalt)/.test(linje)) {
        const match = linje.match(/(\d{1,3}(?:[.,\s]?\d{3})*(?:[.,]\d{2})?)/);
        if (match) {
          let tall = match[0].replace(/\s/g, "").replace(/,/g, ".").replace(/\.(?=\d{3})/, "");
          const val = parseFloat(tall);
          if (!isNaN(val) && val > max) max = val;
        }
      }
    }
    return max ? max.toFixed(2) : "";
  };

  const hentKurs = async (fra: string, til: string, dato: string): Promise<{ rate: number; faktiskDato: string }> => {
    const iso = dato.split(".").reverse().join("-");
    const res = await fetch(`https://api.frankfurter.app/${iso}?from=${fra}&to=${til}`);
    const data = await res.json();
    return {
      rate: data?.rates?.[til] || 0,
      faktiskDato: data?.date || iso,
    };
  };

  const lesKvittering = async () => {
    if (!fil) return;
    setStatus("Leser kvittering...");
    const canvas = fil.type === "application/pdf" ? await pdfTilBilde(fil) : await bildeTilCanvas(fil);
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
      setStatus("Ferdig (ingen valutaomregning)");
    } else {
      const { rate, faktiskDato } = await hentKurs(valutaFunnet, "NOK", datoen);
      const omregnet = parseFloat(belopBase) * rate;
      setBelop(omregnet.toFixed(2));
      setStatus(`Ferdig · Kurs: ${rate.toFixed(4)} (${faktiskDato})`);
    }
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
        belop_original: parseFloat(belopOriginal),
        valuta,
        dato: datoISO,
        fil_url: urlData?.publicUrl || null,
        opprettet: new Date().toISOString(),
        arkivert: new Date(datoISO).getFullYear() < new Date().getFullYear(),
        nok: valuta !== "NOK" ? parseFloat(belop) : null,
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
        <input type="text" placeholder="Tittel (skriv selv)" value={tittel} onChange={(e) => setTittel(e.target.value)} className="p-3 border rounded-xl" />
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
