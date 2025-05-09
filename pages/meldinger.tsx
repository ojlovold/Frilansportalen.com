import Head from "next/head";
import Header from "../components/Header";
import ReportBox from "../components/ReportBox";
import SuggestionBox from "../components/SuggestionBox";
import ErrorBox from "../components/ErrorBox";
import { useState } from "react";

export default function Meldinger() {
  const [showError, setShowError] = useState(false);
  const [suggestionAccepted, setSuggestionAccepted] = useState(false);

  return (
    <>
      <Head>
        <title>Meldinger | Frilansportalen</title>
        <meta name="description" content="Send og motta meldinger direkte i Frilansportalen" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Meldinger</h1>

        {!suggestionAccepted && (
          <SuggestionBox
            suggestion="Svar raskt og vennlig – AI foreslår: 'Hei! Jeg er interessert i oppdraget ditt og tilgjengelig denne uken.'"
            onAccept={() => set
