import Head from "next/head";
import Layout from "../components/Layout";
import SuggestionBox from "../components/SuggestionBox";
import ErrorBox from "../components/ErrorBox";
import ReportBox from "../components/ReportBox";
import { useState } from "react";

export default function Meldinger() {
  const [showError, setShowError] = useState(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Meldinger | Frilansportalen</title>
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
