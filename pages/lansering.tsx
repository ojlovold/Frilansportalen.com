import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Lansering() {
  const [lansert, setLansert] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const startLansering = () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    // Her vil du normalt sende et API-kall til backend for å "skru på portalen"
    setLansert(true);
  };

  return (
    <>
      <Head>
        <title>Lansering | Frilansportalen</title>
        <meta name="description" content="Start portalen – gjør Frilansportalen synlig for verden" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Portalen er i standby-modus</h1>

        {lansert ? (
          <p className="text-green-700 text-xl font-semibold">Portalen er nå lansert!</p>
        ) : (
          <>
            <p className="mb-4">
              Du kan nå starte Frilansportalen for offentlig bruk. Denne handlingen kan ikke reverseres uten å deaktivere systemet manuelt.
            </p>
            <button
              onClick={startLansering}
              className={`px-6 py-3 rounded text-white font-bold ${
                confirm ? "bg-red-600 hover:bg-red-700" : "bg-black hover:bg-gray-800"
              }`}
            >
              {confirm ? "Bekreft lansering" : "Start lansering"}
            </button>
          </>
        )}
      </main>
    </>
  );
}
