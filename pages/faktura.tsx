import Head from "next/head";
import Layout from "../components/Layout";
import SuggestionBox from "../components/SuggestionBox";
import ErrorBox from "../components/ErrorBox";
import ReportBox from "../components/ReportBox";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Meldinger() {
  const [showError, setShowError] = useState(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);
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

  if (loading) return <Layout><p className="text-sm">Laster meldinger...</p></Layout>;

  return (
    <Layout>
      <Head>
        <title>Meldinger | Frilansportalen</title>
        <meta name="description" content="Send og motta meldinger direkte i Frilansportalen" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Meldinger</h1>

      {!suggestionAccepted && (
        <SuggestionBox
          suggestion="Svar raskt og vennlig – AI foreslår: 'Hei! Jeg er interessert i oppdraget ditt og kan starte allerede denne uken.'"
          onAccept={() => setSuggestionAccepted(true)}
        />
      )}

      {showError && (
        <ErrorBox
          message="Noe gikk galt under sending. Prøv igjen senere."
          onClose={() => setShowError(false)}
        />
      )}

      <ReportBox onSend={() => setShowError(true)} />
    </Layout>
  );
}
