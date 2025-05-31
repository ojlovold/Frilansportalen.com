// AutoUtfyllKvitteringSmart.tsx – alt du trenger, inkludert arkiv etter år og korrekt datolesing

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
  const [liste, setListe] = useState<any[]>([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

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
    const mønstre = [
      /\b(\d{2})[./-](\d{2})[./-](\d{4})\b/,              // 05.05.2025
      /\b(\d{4})[./-](\d{2})[./-](\d{2})\b/,              // 2025-05-05
      /\b([A-Za-z]+) (\d{1,2}), (\d{4})\b/,              // May 5, 2025
      /\b(\d{1,2}) ([A-Za-z]+) (\d{4})\b/                // 5 May 2025
    ];
    const måneder: any = {
      january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
      july: "07", august: "08", september: "09", october: "10", november: "11", december: "12"
    };

    for (const mønster of mønstre) {
      const match = tekst.match(mønster);
      if (match) {
        if (match.length === 4 && isNaN(Number(match[1]))) {
          const mnd = måneder[match[1].toLowerCase()];
          return `${match[2].padStart(2, "0")}.${mnd}.${match[3]}`;
        } else if (match.length === 4 && isNaN(Number(match[2]))) {
          const mnd = måneder[match[2].toLowerCase()];
          return `${match[1].padStart(2, "0")}.${mnd}.${match[3]}`;
        } else if (match.length === 4) {
          return `${match[1].padStart(2, "0")}.${match[2].padStart(2, "0")}.${match[3]}`;
        }
      }
    }
    return "01.01.2024";
  };

  const hentKvitteringer = async () => {
    const { data } = await supabase
      .from("kvitteringer")
      .select("*")
      .eq("bruker_id", user?.id)
      .order("dato", { ascending: false });
    const unike = Object.values(
      (data || []).reduce((acc, k) => {
        acc[k.fil_url] = k;
        return acc;
      }, {} as Record<string, any>)
    );
    setListe(unike);
  };

  useEffect(() => {
    if (!fil) hentKvitteringer();
  }, [fil]);

  const slett = async (id: string, fil_url: string) => {
    const path = fil_url.split("/").slice(7).join("/");
    await supabase.storage.from("kvitteringer").remove([path]);
    await supabase.from("kvitteringer").delete().eq("id", id);
    await supabase.from("bruker_utgifter").delete().eq("fil_url", fil_url);
    setListe((prev) => prev.filter((k) => k.id !== id));
  };

  const grupperteKvitteringer = () => {
    const grupper: Record<string, any[]> = {};
    liste.forEach((k) => {
      const år = k.dato?.split("-")[0] || "Ukjent";
      if (!grupper[år]) grupper[år] = [];
      grupper[år].push(k);
    });
    return grupper;
  };

  const sorterGrupper = (grupper: Record<string, any[]>) => {
    return Object.keys(grupper).sort((a, b) => Number(b) - Number(a));
  };

  // resten (lesKvittering, lagreKvittering, visning) kommer i neste melding
  const finnValuta = (tekst: string): string => {
    const lower = tekst.toLowerCase();
    if (lower.includes("usd") || lower.includes("$")) return "USD";
    if (lower.includes("eur")) return "EUR";
    if (lower.includes("gbp")) return "GBP";
    if (lower.includes("nok") || lower.includes("kr")) return "NOK";
    return "NOK";
  };

  const finnTotalbelop = (tekst: string): string => {
    const linjer = tekst.split("\n").map((l) => l.trim().toLowerCase());
    const kandidater: number[] = [];

    for (const linje of linjer) {
      if (/(total|amount paid|sum|beløp|betalt|subtotal)/.test(linje)) {
        const matches = [...linje.matchAll(/\d[\d.,]+/g)];
        const tall = matches
          .map((m) => m[0].replace(/\.(?=\d{3})/g, "").replace(",", "."))
          .map((str) => parseFloat(str))
          .filter((val) => !isNaN(val) && val > 0 && val < 100000);
        kandidater.push(...tall);
      }
    }

    const valgt = kandidater.length > 0 ? kandidater[kandidater.length - 1] : 0;
    return valgt > 0 ? valgt.toFixed(2) : "";
  };

  const hentKurs = async (fra: string, til: string, dato: string): Promise<number> => {
    const iso = dato.split(".").reverse().join("-");
    try {
      const res = await fetch(`https://api.frankfurter.app/${iso}?from=${fra}&to=${til}`);
      const data = await res.json();
      return data.rates?.[til] || 1;
    } catch {
      return 1;
    }
  };

  const lesKvittering = async (fil: File) => {
    setStatus("Leser kvittering...");
    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        forbedreKontrast(canvas);
        const result = await Tesseract.recognize(canvas, "eng+nor", { logger: () => {} });
        const text = result.data.text;
        setTekst(text);

        const d = parseDato(text);
        const v = finnValuta(text);
        const b = finnTotalbelop(text);
        setDato(d);
        setValuta(v);
        setBelopOriginal(b);

        if (v === "NOK" || v === "") {
          setBelop(b);
        } else {
          const kurs = await hentKurs(v, "NOK", d);
          setBelop((parseFloat(b) * kurs).toFixed(2));
        }

        setStatus("Ferdig");
      };
    };
    reader.readAsDataURL(fil);
  };

  const lagreKvittering = async () => {
    if (!user?.id || !fil || !tittel || !belop || !dato) return;
    const datoISO = dato.split(".").reverse().join("-");
    const trygtTittel = tittel.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "-").slice(0, 60);
    const filnavn = `${user.id}-${Date.now()}-${trygtTittel || "kvittering"}`;

    const { error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(`bruker/kvitteringer/${filnavn}`, fil, {
        upsert: true,
      });
    if (uploadError) return setStatus("Feil: " + uploadError.message);

    const { data: urlData } = supabase.storage
      .from("kvitteringer")
      .getPublicUrl(`bruker/kvitteringer/${filnavn}`);
    const publicUrl = urlData?.publicUrl || null;

    const finnes = await supabase.from("kvitteringer").select("id").eq("fil_url", publicUrl).maybeSingle();
    if (finnes.data) return setStatus("Kvittering finnes allerede.");

    await supabase.from("kvitteringer").insert([
      {
        bruker_id: user.id,
        tittel,
        belop: parseFloat(belopOriginal),
        valuta,
        nok: parseFloat(belop),
        dato: datoISO,
        fil_url: publicUrl,
        opprettet: new Date().toISOString(),
      },
    ]);

    await supabase.from("bruker_utgifter").insert([
      {
        bruker_id: user.id,
        tittel,
        dato: datoISO,
        valuta,
        belop: parseFloat(belopOriginal),
        nok: parseFloat(belop),
        fil_url: publicUrl,
        opprettet: new Date().toISOString(),
      },
    ]);

    setStatus("Kvittering lagret!");
    setFil(null);
    hentKvitteringer();
  };

  return (
    <div className="bg-yellow-100 p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Autoutfyll kvittering</h2>

      <input type="file" accept=".pdf,image/*" onChange={(e) => setFil(e.target.files?.[0] || null)} className="w-full" />
      <pre className="text-sm bg-white p-2 rounded whitespace-pre-wrap">{tekst || "Ingen tekst funnet."}</pre>

      <input type="text" placeholder="Tittel" value={tittel} onChange={(e) => setTittel(e.target.value)} className="w-full p-2 border rounded" />
      <input type="text" placeholder="Originalt beløp" value={belopOriginal} readOnly className="w-full p-2 border rounded bg-gray-100" />
      <input type="text" placeholder="Valuta" value={valuta} onChange={(e) => setValuta(e.target.value)} className="w-full p-2 border rounded" />
      <input type="text" placeholder="Omregnet til NOK" value={belop} readOnly className="w-full p-2 border rounded bg-gray-100" />
      <input type="text" placeholder="Dato (dd.mm.yyyy)" value={dato} onChange={(e) => setDato(e.target.value)} className="w-full p-2 border rounded" />

      <button onClick={lagreKvittering} className="w-full bg-black text-white px-4 py-2 rounded-xl">
        Lagre kvittering
      </button>

      <button onClick={() => router.push("/kvitteringer")} className="w-full bg-gray-700 text-white px-4 py-2 rounded-xl">
        Se mine kvitteringer
      </button>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}

      {sorterGrupper(grupperteKvitteringer()).map((år) => (
        <div key={år} className="mt-6 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Kvitteringer {år}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Dato</th>
                <th>Tittel</th>
                <th>Beløp</th>
                <th>Valuta</th>
                <th>NOK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grupperteKvitteringer()[år].map((k: any) => (
                <tr key={k.id} className="border-t">
                  <td>{k.dato}</td>
                  <td>{k.tittel}</td>
                  <td>{k.belop}</td>
                  <td>{k.valuta}</td>
                  <td>{k.nok}</td>
                  <td>
                    <button onClick={() => slett(k.id, k.fil_url)} className="text-red-600 text-sm">
                      Slett
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
