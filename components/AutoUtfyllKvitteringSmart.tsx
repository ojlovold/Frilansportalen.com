import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import Image from "next/image";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function generateUUID() {
  return crypto.randomUUID();
}

export default function AutoUtfyllKvitteringSmart({ rolle }: { rolle: "admin" | "bruker" }) {
  const [fil, setFil] = useState<File | null>(null);
  const [tekst, setTekst] = useState("");
  const [tittel, setTittel] = useState("");
  const [belop, setBelop] = useState("");
  const [belopOriginal, setBelopOriginal] = useState("");
  const [dato, setDato] = useState("");
  const [valuta, setValuta] = useState("NOK");
  const [forhandsvisning, setForhandsvisning] = useState<string | null>(null);
  const [opplastingStatus, setOpplastingStatus] = useState("");
  const [vedleggUrl, setVedleggUrl] = useState("");
  const [status, setStatus] = useState("aktiv");

  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (!fil) return;

    const behandleFil = async () => {
      if (fil.type === "application/pdf") {
        const buffer = await fil.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(1);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(" ");
        setTekst(text);
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          setForhandsvisning(dataUrl);
          const result = await Tesseract.recognize(dataUrl, "eng+nor");
          setTekst(result.data.text);
        };
        reader.readAsDataURL(fil);
      }
    };

    behandleFil();
  }, [fil]);

  useEffect(() => {
    if (!tekst) return;

    const belopMatch = tekst.match(/(\d{1,3}(?:[.,\s]\d{3})*[.,]\d{2})\s?(NOK|kr|USD|EUR)?/i);
    if (belopMatch) {
      const raw = belopMatch[1].replace(/\s/g, "").replace(",", ".");
      setBelopOriginal(raw);
      setBelop(raw);
      if (belopMatch[2]) {
        const valutaRenset = belopMatch[2].toUpperCase().replace("KR", "NOK");
        setValuta(valutaRenset);
      }
    }

    const datoMatch = tekst.match(/(\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4})/);
    if (datoMatch) setDato(datoMatch[1]);

    if (!tittel && fil) setTittel(fil.name.replace(/\.[^/.]+$/, ""));
  }, [tekst]);

  const lagreKvittering = async () => {
    if (!fil || !user) return;

    setOpplastingStatus("Lagrer...");

    const filnavn = `${generateUUID()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("kvitteringer")
      .upload(filnavn, fil);

    if (uploadError) {
      setOpplastingStatus("Feil under opplasting");
      return;
    }

    const url = supabase.storage.from("kvitteringer").getPublicUrl(filnavn).data.publicUrl;
    setVedleggUrl(url);

    const { error: insertError } = await supabase.from("kvitteringer").insert([
      {
        bruker_id: user.id,
        tittel,
        belop,
        belop_original: belopOriginal,
        dato,
        valuta,
        tekst,
        vedlegg_url: url,
        status,
      },
    ]);

    if (insertError) {
      setOpplastingStatus("Feil ved lagring");
    } else {
      setOpplastingStatus("Kvittering lagret");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">AutoUtfyll Kvittering</h1>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="p-2 border rounded"
      />

      {forhandsvisning && (
        <div className="mt-4">
          <Image src={forhandsvisning} alt="Forhåndsvisning" width={300} height={300} />
        </div>
      )}

      <input
        type="text"
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Beløp"
        value={belop}
        onChange={(e) => setBelop(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Dato"
        value={dato}
        onChange={(e) => setDato(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Valuta"
        value={valuta}
        onChange={(e) => setValuta(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={lagreKvittering}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Lagre Kvittering
      </button>

      {opplastingStatus && <p>{opplastingStatus}</p>}
    </div>
  );
}
