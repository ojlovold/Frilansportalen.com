import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Signering() {
  const [signertBruker, setSignertBruker] = useState(false);
  const [signertArbeidsgiver, setSignertArbeidsgiver] = useState(false);

  const fullført = signertBruker && signertArbeidsgiver;

  return (
    <>
      <Head>
        <title>Signering | Frilansportalen</title>
        <meta name="description" content="Signer kontrakter direkte og lagre dem i arkivet" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Signering av kontrakt</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <p><strong>Avtale:</strong> Utførelse av oppdrag mellom arbeidsgiver og frilanser.</p>
          <p><strong>Innhold:</strong> Det avtales at frilanser skal utføre tjenesten som beskrevet og få utbetalt honorar etter avtale.</p>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex-1 mr-2">
            <p className="font-semibold mb-1">Frilanser</p>
            {signertBruker ? (
              <p className="text-green-700">Signert</p>
            ) : (
              <button
                onClick={() => setSignertBruker(true)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Signer
              </button>
            )}
          </div>
          <div className="flex-1 ml-2">
            <p className="font-semibold mb-1">Arbeidsgiver</p>
            {signertArbeidsgiver ? (
              <p className="text-green-700">Signert</p>
            ) : (
              <button
                onClick={() => setSignertArbeidsgiver(true)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Signer
              </button>
            )}
          </div>
        </div>

        {fullført && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded">
            <p className="font-bold text-lg">Avtalen er nå signert av begge parter!</p>
            <p>Avtalen kan nå lagres i brukerens arkiv.</p>
          </div>
        )}
      </main>
    </>
  );
}
