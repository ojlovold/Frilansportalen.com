import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Firma() {
  const [orgnr, setOrgnr] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [melding, setMelding] = useState("");
  const [feil, setFeil] = useState("");

  const hentInfo = async () => {
    setMelding("");
    setFeil("");
    setInfo(null);

    if (!orgnr || orgnr.length !== 9) {
      setFeil("Oppgi gyldig organisasjonsnummer (9 siffer)");
      return;
    }

    try {
      const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
      if (!res.ok) throw new Error("Ingen data funnet");
      const data = await res.json();
      setInfo(data);
    } catch {
      setFeil("Fant ikke firmaet i Brønnøysundregisteret");
    }
  };

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id || !info) return;

    const navn = info.navn || "";
    const adresse = info.forretningsadresse?.adresse || "";
    const postnr = info.forretningsadresse?.postnummer || "";
    const sted = info.forretningsadresse?.kommune || "";
    const orgform = info.organisasjonsform?.beskrivelse || "";

    const { error } = await supabase
      .from("profiler")
      .update({
        firmanavn: navn,
        orgnr,
        adresse,
        poststed: `${postnr} ${sted}`,
        organisasjonsform: orgform,
      })
      .eq("id", id);

    setMelding(error ? "Kunne ikke lagre firmainformasjon" : "Firmainformasjon lagret!");
  };

  return (
    <Layout>
      <Head>
        <title>Registrer firma | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Firmaregistrering</h1>

        <input
          value={orgnr}
          onChange={(e) => setOrgnr(e.target.value)}
          placeholder="Organisasjonsnummer"
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={hentInfo}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 w-full"
        >
          Hent informasjon
        </button>

        {feil && <p className="text-sm text-red-600 mt-4">{feil}</p>}

        {info && (
          <>
            <div className="bg-white border rounded p-4 mt-6 text-sm space-y-2">
              <p><strong>Navn:</strong> {info.navn}</p>
              <p><strong>Adresse:</strong> {info.forretningsadresse?.adresse}</p>
              <p><strong>Postnummer:</strong> {info.forretningsadresse?.postnummer}</p>
              <p><strong>Sted:</strong> {info.forretningsadresse?.kommune}</p>
              <p><strong>Organisasjonsform:</strong> {info.organisasjonsform?.beskrivelse}</p>
            </div>

            <button
              onClick={lagre}
              className="bg-green-700 text-white px-4 py-2 rounded text-sm hover:bg-green-800 mt-4 w-full"
            >
              Lagre til profilen min
            </button>
          </>
        )}

        {melding && <p className="text-green-600 text-sm mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}
