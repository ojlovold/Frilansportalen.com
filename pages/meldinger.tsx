import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import AccessibilityPanel from "../components/AccessibilityPanel";

export default function Meldinger() {
  const [showError, setShowError] = useState(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);
  const [melding, setMelding] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sjekkInnlogging = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    sjekkInnlogging();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster meldingsmodul...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Meldinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Meldinger</h1>

      <div className="max-w-xl space-y-6">
        <label className="block text-sm">
          Din melding:
          <textarea
            className="mt-1 p-2 border rounded w-full h-28 resize-none"
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
          />
        </label>

        <AccessibilityPanel
          tekst={melding}
          onDiktert={(verdi) => setMelding(verdi)}
        />

        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
          Send melding
        </button>
      </div>
    </Layout>
  );
}
