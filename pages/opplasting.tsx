import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";

export default function Opplasting() {
  const [filnavn, setFilnavn] = useState("");
  const [opplastet, setOpplastet] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Lagre fil til backend eller Supabase storage
    console.log("Fil lagret:", filnavn);
    setOpplastet(true);
    setFilnavn("");
  };

  return (
    <>
      <Head>
        <title>Last opp fil | Frilansportalen</title>
        <meta name="description" content="Lagre dokumenter, kontrakter og skjemaer i ditt arkiv" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Last opp til arkivet</h1>

        {opplastet ? (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded">
            <p className="font-semibold">Filen er lagret!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Filnavn (simulert):</label>
              <input
                type="text"
                value={filnavn}
                onChange={(e) => setFilnavn(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Last opp
            </button>
          </form>
        )}
      </main>
    </>
  );
}
