import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Inbox() {
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const hurtigsvar = [
    "Hei, jeg er interessert!",
    "Kan vi avtale tidspunkt?",
    "Hva er honoraret?",
    "Når ønskes oppstart?",
  ];

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const brukerId = bruker.data.user?.id;

      if (!brukerId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("meldinger")
        .select("fra, melding, tidspunkt")
        .eq("til", brukerId)
        .order("tidspunkt", { ascending: false });

      if (!error && data) {
        setMeldinger(data);
      }

      setLoading(false);
    };

    hent();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster innboks...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Innboks | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Innboks</h1>

      {meldinger.length === 0 ? (
        <p className="text-sm text-gray-600">Du har ingen meldinger ennå.</p>
      ) : (
        <ul className="space-y-6 bg-white border border-black rounded p-4 text-sm">
          {meldinger.map(({ fra, melding, tidspunkt }, i) => (
            <li key={i} className="border-b border-gray-200 pb-4">
              <p className="text-gray-600 mb-1">
                <strong>{tidspunkt.split("T")[0]}</strong> fra <code className="text-xs">{fra}</code>
              </p>
              <p className="mb-2">{melding}</p>

              <div className="flex flex-wrap gap-2">
                {hurtigsvar.map((svar, index) => (
                  <button
                    key={index}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-xs"
                    onClick={() => alert(`(Simulert svar): ${svar}`)}
                  >
                    {svar}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}
