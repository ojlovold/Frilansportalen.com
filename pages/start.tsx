import Head from "next/head";
import Layout from "../components/Layout";
import { useState } from "react";

export default function Startside() {
  const [publisert, setPublisert] = useState(false);

  const start = () => {
    const bekreft = confirm("Er du sikker på at du vil publisere Frilansportalen?");
    if (!bekreft) return;

    // Her kan du sette en Supabase-flagg i en tabell som gjør portalen offentlig
    setPublisert(true);
  };

  return (
    <Layout>
      <Head>
        <title>Start Frilansportalen | Admin</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Klar for publisering</h1>

        {publisert ? (
          <p className="text-green-600">Frilansportalen er nå publisert!</p>
        ) : (
          <button
            onClick={start}
            className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
          >
            Publiser Frilansportalen nå
          </button>
        )}
      </div>
    </Layout>
  );
}
