import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useState } from "react";

export default function Startside() {
  const [visMer, setVisMer] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Velkommen | Frilansportalen</title>
      </Head>

      <div className="max-w-2xl mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Velkommen til Frilansportalen</h1>
        <p className="text-gray-700 mb-6">
          Dette er ditt komplette verktøy for frilans, oppdrag, regnskap og mer.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link href="/auth" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
            Logg inn eller registrer
          </Link>
          <Link href="/stillinger" className="border border-black px-6 py-3 rounded hover:bg-gray-50">
            Utforsk stillinger
          </Link>
        </div>

        <button
          onClick={() => setVisMer(!visMer)}
          className="text-sm underline text-blue-600 hover:text-blue-800"
        >
          {visMer ? "Skjul detaljer" : "Vis mer informasjon"}
        </button>

        {visMer && (
          <div className="mt-6 text-sm text-left bg-white border rounded p-4 space-y-3">
            <p>• Send og motta meldinger med vedlegg</p>
            <p>• Få automatiske varsler når ting skjer</p>
            <p>• Lag faktura, kjørebok, MVA og årsoppgjør</p>
            <p>• Del profilen din med arbeidsgivere eller skjul den</p>
            <p>• Få hjelp av innebygd AI, tale-til-tekst og opplesning</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
