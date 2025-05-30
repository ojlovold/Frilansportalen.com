// components/AutoUtfyllKvitteringSmart.tsx

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.entry";
import { useRouter } from "next/router";
import Image from "next/image";

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
  const [forhåndsvisning, setForhåndsvisning] = useState<string | null>(null);

  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (!fil) return;
    const reader = new FileReader();
    reader.onload = () => setForhåndsvisning(reader.result as string);
    reader.readAsDataURL(fil);
  }, [fil]);

  const behandlePDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const texts = content.items.map((item: any) => item.str);
      fullText += texts.join(" ") + "\n";
    }

    setTekst(fullText);
    identifiserData(fullText);
  };

  const behandleBilde = async (file: File) => {
    const { data } = await Tesseract.recognize(file, "eng", {
      logger: () => {},
    });
    setTekst(data.text);
    identifiserData(data.text);
  };

  const identifiserData = (text: string) => {
    const sumMatch = text.match(/(\d{1,3}(?:[\., ]\d{3})*[\.,]\d{2})/);
    const datoMatch = text.match(/\d{2}\.\d{2}\.\d{4}/);
    const valutamatch = text.match(/(?:NOK|EUR|USD|SEK|DKK|GBP)/i);

    if (sumMatch) {
      const renset = sumMatch[1].replace(/ /g, "").replace(",", ".");
      setBelopOriginal(renset);
      if (valuta === "NOK") setBelop(renset);
    }
    if (datoMatch) setDato(datoMatch[0]);
    if (valutamatch) setValuta(valutamatch[0].toUpperCase());
  };

  const lastOppKvittering = async () => {
    if (!user) {
      setStatus("Du må være innlogget for å laste opp kvitteringer.");
      return;
    }
    if (!fil) {
      setStatus("Ingen fil valgt.");
      return;
    }

    const filnavn = `${user.id}/${fil.name}`;
    const { data: eksisterende, error: sjekkFeil } = await supabase
      .storage
      .from("kvitteringer")
      .list(user.id + "/", { search: fil.name });

    if (eksisterende && eksisterende.length > 0) {
      setStatus("En kvittering med dette navnet finnes allerede.");
      return;
    }

    const { error: uploadError } = await supabase.storage.from("kvitteringer").upload(filnavn, fil, {
      contentType: fil.type,
      upsert: false,
    });

    if (uploadError) {
      setStatus("Feil ved opplasting: " + uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from("kvitteringer").insert([
      {
        bruker_id: user.id,
        tittel,
        tekst,
        dato,
        valuta,
        belop,
        belop_original: belopOriginal,
        filnavn,
      },
    ]);

    if (insertError) {
      setStatus("Feil ved lagring i database: " + insertError.message);
    } else {
      setStatus("Kvittering lastet opp og lagret!");
    }
  };

  return (
    <div className="p-4 bg-yellow-100 rounded-xl shadow-lg max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Last opp kvittering</h1>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const valgtFil = e.target.files?.[0] || null;
          setFil(valgtFil);
          setTittel(valgtFil?.name || "");
          if (valgtFil) {
            valgtFil.type === "application/pdf"
              ? behandlePDF(valgtFil)
              : behandleBilde(valgtFil);
          }
        }}
        className="mb-4 w-full"
      />

      {forhåndsvisning && (
        <Image
          src={forhåndsvisning}
          alt="Forhåndsvisning"
          width={400}
          height={300}
          className="rounded mb-4 border"
        />
      )}

      <input
        type="text"
        placeholder="Tittel"
        value={tittel}
        onChange={(e) => setTittel(e.target.value)}
        className="w-full mb-2 p-2 rounded border"
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          placeholder="Dato"
          value={dato}
          onChange={(e) => setDato(e.target.value)}
          className="p-2 rounded border"
        />
        <input
          type="text"
          placeholder="Valuta"
          value={valuta}
          onChange={(e) => setValuta(e.target.value.toUpperCase())}
          className="p-2 rounded border"
        />
        <input
          type="text"
          placeholder="Beløp (NOK)"
          value={belop}
          onChange={(e) => setBelop(e.target.value)}
          className="p-2 rounded border col-span-2"
        />
      </div>

      <button
        onClick={lastOppKvittering}
        className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-90"
      >
        Lagre kvittering
      </button>

      {status && <p className="mt-4 text-sm text-red-600">{status}</p>}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/kvitteringer")}
          className="bg-gray-600 text-white px-4 py-2 rounded-2xl shadow hover:opacity-90"
        >
          Se mine kvitteringer
        </button>
      </div>
    </div>
  );
}
