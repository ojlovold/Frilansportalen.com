import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function PDFGenerator() {
  const [generert, setGenerert] = useState(false);

  const generer = () => {
    setGenerert(true);
    // TODO: Koble til faktisk PDF-generering senere
    console.log("PDF generert og lagret.");
  };

  return (
    <>
      <Head>
        <title>PDF-generator | Frilansportalen</title>
        <meta name="description" content="Generer og last ned fakturaer, kontrakter og rapporter" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">PDF-generator</h1>

        {generert ? (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded">
            <p>PDF generert!</p>
            <p><a href="#" className="underline">Klikk her for å laste ned</a></p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Trykk på knappen under for å generere en PDF av faktura eller kontrakt.</p>
            <button onClick={generer} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Generer PDF
            </button>
          </div>
        )}
      </main>
    </>
  );
}
