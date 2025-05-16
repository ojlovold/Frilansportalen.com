import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function RegistrerFirma() {
  const router = useRouter();
  const [orgnr, setOrgnr] = useState("");
  const [firma, setFirma] = useState<any>(null);
  const [bruker, setBruker] = useState<any>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setBruker(data?.user || null);
    });
  }, []);

  const hentFirma = async () => {
    setStatus("Henter informasjon...");
    const res = await fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`);
    if (!res.ok) {
      setStatus("Fant ikke firma i Brønnøysund.");
      return;
    }
    const data = await res.json();
    setFirma(data);
    setStatus("");
  };

  const opprettFirma = async () => {
    if (!firma || !bruker) return;

    setStatus("Lagrer firmaprofil...");

    const { data, error } = await supabase.from("firmaer").upsert({
      organisasjonsnummer: firma.organisasjonsnummer,
      navn: firma.navn,
      adresse: firma.forretningsadresse?.adresse?.[0] || null,
      postnummer: firma.forretningsadresse?.postnummer || null,
      poststed: firma.forretningsadresse?.poststed || null,
      kommune: firma.forretningsadresse?.kommune || null,
      fylke: firma.forretningsadresse?.kommunenummer?.slice(0, 2) || null,
      nettside: firma.hjemmeside || null,
      bransje: firma.naeringskode1?.beskrivelse || null
    });

    if (error) {
      setStatus("Feil ved lagring: " + error.message);
      return;
    }

    const { data: kobling, error: brukerError } = await supabase
      .from("brukere")
      .update({ firma_id: data?.id || null })
      .eq("id", bruker.id);

    if (brukerError) {
      setStatus("Firma ble opprettet, men brukeren ble ikke koblet.");
      return;
    }

    setStatus("Firma registrert! Sender deg videre...");
    setTimeout(() => router.push(`/firma/${firma.organisasjonsnummer}`), 1500);
  };

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <Head>
        <title>Registrer firmaprofil | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto bg-gray-200 p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Registrer firmaprofil</h1>

        {!firma && (
          <>
            <label className="block mb-2 font-semibold">Organisasjonsnummer</label>
            <input
              value={orgnr}
              onChange={(e) => setOrgnr(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Skriv inn org.nr"
            />
            <button
              onClick={hentFirma}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Hent informasjon
            </button>
          </>
        )}

        {firma && (
          <>
            <p className="mb-2"><strong>Navn:</strong> {firma.navn}</p>
            <p className="mb-2"><strong>Adresse:</strong> {firma.forretningsadresse?.adresse?.[0]}</p>
            <p className="mb-2"><strong>Poststed:</strong> {firma.forretningsadresse?.postnummer} {firma.forretningsadresse?.poststed}</p>
            <p className="mb-2"><strong>Bransje:</strong> {firma.naeringskode1?.beskrivelse}</p>
            <p className="mb-4"><strong>Nettside:</strong> {firma.hjemmeside || "Ikke oppgitt"}</p>

            <button
              onClick={opprettFirma}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Opprett firmaprofil
            </button>
          </>
        )}

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </main>
  );
}
