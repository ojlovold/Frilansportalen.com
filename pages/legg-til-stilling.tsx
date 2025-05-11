import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useAiAssist from "../utils/useAiAssist";
import SuccessBox from "../components/SuccessBox";

export default function LeggTilStilling() {
  const [tittel, setTittel] = useState("");
  const [sted, setSted] = useState("");
  const [type, setType] = useState("heltid");
  const [bransje, setBransje] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [melding, setMelding] = useState("");

  const { getSvar, svar, laster, feil } = useAiAssist();

  const foreslå = () => {
    const prompt = `Gi forslag til en stillingsannonse. Type: ${type}, sted: ${sted || "ikke oppgitt"}. Inkluder tittel, bransje og beskrivelse. Returner kun rå tekst.`;
    getSvar(prompt, "Du er ekspert på å skrive gode stillingsannonser for en norsk jobbplattform.");
  };

  const brukForslag = () => {
    const linjer = svar.split("\n");
    setTittel(linjer.find((l) => l.toLowerCase().includes("tittel:"))?.split(":")[1]?.trim() || "");
    setBransje(linjer.find((l) => l.toLowerCase().includes("bransje:"))?.split(":")[1]?.trim() || "");
    setBeskrivelse(linjer.slice(3).join("\n").trim());
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) return;

    const { error } = await supabase.from("stillinger").insert({
      opprettet_av: id,
      tittel,
      sted,
      type,
      bransje,
      beskrivelse,
      opprettet_dato: new Date().toISOString(),
    });

    if (error) setMelding("Feil under lagring");
    else {
      setMelding("Stillingen er publisert!");
      setTittel(""); setSted(""); setBransje(""); setBeskrivelse("");
    }
  };

  return (
    <Layout>
      <Head><title>Ny stilling</title></Head>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Publiser stillingsannonse</h1>

        <div className="flex gap-2 mb-4">
          <button onClick={foreslå} className="bg-gray-700 text-white px-3 py-1 rounded text-xs">Foreslå med AI</button>
          {svar && (
            <button onClick={brukForslag} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Bruk forslag</button>
          )}
        </div>

        {laster && <p className="text-xs text-gray-500 mb-2">Henter forslag fra AI...</p>}
        {feil && <p className="text-xs text-red-600 mb-2">{feil}</p>}

        <input value={tittel} onChange={(e) => setTittel(e.target.value)} placeholder="Tittel"
          className="w-full p-2 border rounded mb-3" />
        <input value={sted} onChange={(e) => setSted(e.target.value)} placeholder="Sted"
          className="w-full p-2 border rounded mb-3" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded mb-3">
          <option value="heltid">Heltid</option>
          <option value="deltid">Deltid</option>
          <option value="oppdrag">Oppdrag</option>
        </select>
        <input value={bransje} onChange={(e) => setBransje(e.target.value)} placeholder="Bransje"
          className="w-full p-2 border rounded mb-3" />
        <textarea value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)} placeholder="Beskrivelse"
          className="w-full p-2 border rounded mb-3 h-32 resize-none" />

        <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">Publiser stilling</button>

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
