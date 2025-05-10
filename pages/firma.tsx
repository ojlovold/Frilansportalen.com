import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import SuccessBox from "../components/SuccessBox";

export default function Firma() {
  const [orgnr, setOrgnr] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [melding, setMelding] = useState("");
  const [feil, setFeil] = useState("");

  const hentInfo = async () => {
    setMelding(""); setFeil(""); setInfo(null);
    if (!orgnr || orgnr.length !== 9) return setFeil("Ugyldig organisasjonsnummer");

    try {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInfo(data);
    } catch {
      setFeil("Fant ikke firmaet");
    }
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id || !info) return;

    const { navn, organisasjonsform } = info;
    const a = info.forretningsadresse;
    const { error } = await supabase.from("profiler").update({
      firmanavn: navn,
      orgnr,
      adresse: a?.adresse || "",
      poststed: `${a?.postnummer || ""} ${a?.kommune || ""}`,
      organisasjonsform: organisasjonsform?.beskrivelse || "",
    }).eq("id", id);

    setMelding(error ? "Feil under lagring" : "Firmainformasjon lagret!");
  };

  return (
    <Layout>
      <Head><title>Firma</title></Head>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Firmaregistrering</h1>

        <input value={orgnr} onChange={(e) => setOrgnr(e.target.value)} placeholder="Organisasjonsnummer" className="w-full p-2 border rounded mb-4" />
        <button onClick={hentInfo} className="bg-black text-white px-4 py-2 rounded text-sm w-full mb-4">Hent informasjon</button>

        {feil && <p className="text-red-600 text-sm mb-4">{feil}</p>}
        {info && (
          <>
            <div className="bg-white border rounded p-4 text-sm space-y-2">
              <p><strong>Navn:</strong> {info.navn}</p>
              <p><strong>Adresse:</strong> {info.forretningsadresse?.adresse}</p>
              <p><strong>Postnr:</strong> {info.forretningsadresse?.postnummer}</p>
              <p><strong>Sted:</strong> {info.forretningsadresse?.kommune}</p>
              <p><strong>Form:</strong> {info.organisasjonsform?.beskrivelse}</p>
            </div>
            <button onClick={lagre} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 mt-4 w-full">Lagre til profilen</button>
          </>
        )}

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
