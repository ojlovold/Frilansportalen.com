import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [belopOriginal, setBelopOriginal] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [status, setStatus] = useState("");
  const [kvitteringer, setKvitteringer] = useState<any[]>([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  const bruker_id = user?.id ?? "5c141119-628a-4316-9ccd-4f1e46c6b146";

  useEffect(() => {
    const hentKvitteringer = async () => {
      const { data, error } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", bruker_id)
        .order("dato", { ascending: false });
      if (!error && data) setKvitteringer(data);
    };
    hentKvitteringer();
  }, [bruker_id]);

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
    const regexer = [
      /\b(\d{2})[./-](\d{2})[./-](\d{2,4})\b/,
      /\b(\d{4})[./-](\d{2})[./-](\d{2})\b/,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i,
    ];
    for (const r of regexer) {
      const match = tekst.match(r);
      if (match) {
        if (match.length === 4 && r.source.includes("jan")) {
          const månedMap: any = {
            jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
            jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
          };
          const måned = månedMap[match[1].slice(0, 3).toLowerCase()] || "01";
          return `${match[2].padStart(2, "0")}.${måned}.${match[3]}`;
        } else if (match.length >= 4) {
          const [_, a, b, c] = match;
          const yyyy = c.length === 2 ? `20${c}` : c;
          return `${a.padStart(2, "0")}.${b.padStart(2, "0")}.${yyyy}`;
        }
      }
    }
    return "";
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
    let canvas;
    if (fil.type === "application/pdf") {
      canvas = await pdfTilBilde(fil);
    } else {
      canvas = await bildeTilCanvas(fil);
    }
    const text = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} }).then((r) => r.data.text || "");
    setTekst(text);

    const datoen = parseDato(text);
    const valutaFunnet = finnValuta(text);
    const belopBase = finnTotalbelop(text);

    setDato(datoen);
    setValuta(valutaFunnet);
    setBelopOriginal(belopBase);

    if (valutaFunnet === "NOK" || valutaFunnet === "") {
      setBelop(belopBase);
    } else {
      const kurs = await hentKurs(valutaFunnet, "NOK", datoen || "2024-01-01");
      const omregnet = parseFloat(belopBase) * kurs;
      setBelop(omregnet.toFixed(2));
    }

    const linjer = text.split("\n").filter((l) => l.length > 3);
    setTittel(linjer[0] || "Kvittering");
    setStatus("Ferdig");
  };

  const lagreKvittering = async () => {
    if (!fil) return setStatus("Mangler fil");
    if (!belop || isNaN(parseFloat(belop))) return setStatus("Mangler beløp");
    if (!dato.match(/^\d{2}\.\d{2}\.\d{4}$/)) return setStatus("Ugyldig dato");

    setStatus("Lagrer...");

    const filnavn = `${Date.now()}-${fil.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(`bruker/kvitteringer/${filnavn}`, fil, { upsert: true });

    if (uploadError) return setStatus("Feil ved opplasting: " + uploadError.message);

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(`bruker/kvitteringer/${filnavn}`);

    const tokenRes = await supabase.auth.getSession();
    let token = tokenRes.data.session?.access_token;

    if (!token && rolle === "admin") {
      token = "TEST_ADMIN_TOKEN"; // 🔐 Bytt til en ekte token om nødvendig for produksjon
    }

    const payload = {
      rolle,
      tittel,
      belop,
      valuta,
      dato,
      bruker_id,
      fil_url: urlData?.publicUrl || null,
    };

    const [resKvitt, resRegn] = await Promise.all([
      fetch("/functions/v1/leggTilKvittering", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      fetch("/functions/v1/leggTilRegnskap", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, type: "utgift", kilde: "Kvittering" }),
      }),
    ]);

    if (resKvitt.ok && resRegn.ok) {
      setStatus("Kvittering lagret!");
      const { data, error } = await supabase
        .from("kvitteringer")
        .select("*")
        .eq("bruker_id", bruker_id)
        .order("dato", { ascending: false });
      if (!error && data) setKvitteringer(data);
    } else {
      const err1 = await resKvitt.text();
      const err2 = await resRegn.text();
      setStatus("Feil: " + err1 + " / " + err2);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl space-y-3">
      <h2 className="text-xl font-semibold">Autoutfyll kvittering</h2>

      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lesKvittering} className="bg-black text-white px-3 py-2 rounded">Les kvittering</button>

      <pre className="bg-gray-100 p-3 text-sm whitespace-pre-wrap rounded">{tekst || "Ingen tekst funnet."}</pre>

      <div className="space-y-2">
        <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
        <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Omregnet til NOK" value={belop} onChange={(e) => setBelop(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <button onClick={lagreKvittering} className="bg-green-600 text-white px-3 py-2 rounded">
        Lagre kvittering
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}

      {kvitteringer.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Eksisterende utgifter</h3>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Dato</th>
                <th className="p-2 border">Tittel</th>
                <th className="p-2 border">Beløp</th>
                <th className="p-2 border">Valuta</th>
              </tr>
            </thead>
            <tbody>
              {kvitteringer.map((rad, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{rad.dato}</td>
                  <td className="p-2 border">{rad.tittel}</td>
                  <td className="p-2 border">{rad.belop}</td>
                  <td className="p-2 border">{rad.valuta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
