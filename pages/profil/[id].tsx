import Head from "next/head";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function OffentligProfil() {
  const router = useRouter();
  const { id } = router.query;

  const [profil, setProfil] = useState<any>(null);
  const [tjenester, setTjenester] = useState<any[]>([]);
  const [rolle, setRolle] = useState<"frilanser" | "jobbsøker" | null>(null);

  useEffect(() => {
    const hent = async () => {
      if (!id || typeof id !== "string") return;

      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      setProfil(data);

      if (data?.rolle === "frilanser") {
        const { data: t } = await supabase.from("tjenester").select("*").eq("opprettet_av", id);
        setTjenester(t || []);
        setRolle("frilanser");
      } else {
        setRolle("jobbsøker");
      }
    };

    hent();
  }, [id]);

  return (
    <Layout>
      <Head>
        <title>Brukerprofil | Frilansportalen</title>
      </Head>

      {!profil ? (
        <p className="text-sm">Laster...</p>
      ) : (
        <div className="max-w-3xl mx-auto mt-6 space-y-8">
          <div className="flex items-center gap-6">
            <img
              src={profil.bilde || "/placeholder.png"}
              alt={profil.navn || "Bruker"}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h1 className="text-2xl font-bold">{profil.navn || "Ukjent bruker"}</h1>
              <p className="text-sm text-gray-600 capitalize">{rolle}</p>
            </div>
          </div>

          {rolle === "frilanser" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Tilbyr følgende tjenester:</h2>
              <ul className="space-y-2 text-sm">
                {tjenester.length === 0 ? (
                  <li className="text-gray-500">Ingen tjenester registrert.</li>
                ) : (
                  tjenester.map((t, i) => (
                    <li key={i} className="bg-gray-100 border border-black rounded p-3">
                      <strong>{t.tjeneste}</strong> i {t.sted}
                      <p className="text-xs text-gray-600 mt-1">{t.beskrivelse}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {rolle === "jobbsøker" && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Om denne brukeren:</h2>
              <p className="text-sm text-gray-700">Jobbsøkerprofil. Klar for oppdrag eller ansettelse.</p>
              <p className="text-sm text-gray-700 mt-2">
                Du kan sende melding direkte hvis du ønsker kontakt.
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
