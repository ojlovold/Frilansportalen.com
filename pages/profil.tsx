import Head from "next/head";
import Header from "../components/Header";
import SuggestionBox from "../components/SuggestionBox";
import { useState } from "react";

export default function Profil() {
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [bio, setBio] = useState("");

  return (
    <>
      <Head>
        <title>Min profil | Frilansportalen</title>
        <meta name="description" content="Din offentlige profil – synlig for arbeidsgivere og frilansere" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Min profil</h1>

        {showSuggestion && (
          <SuggestionBox
            suggestion="Legg til en kort og tydelig beskrivelse av deg selv og din erfaring."
            onAccept={() => setShowSuggestion(false)}
          />
        )}

        <label className="block mb-2 font-semibold">Om meg:</label>
        <textarea
          className="w-full p-2 border rounded mb-4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Skriv litt om deg selv..."
        />
      </main>
    </>
  );
}
