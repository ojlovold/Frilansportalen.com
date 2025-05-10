import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function AI() {
  return (
    <Layout>
      <Head>
        <title>AI-assistent | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">AI-assistent</h1>

      <div className="bg-white border border-black rounded p-4 text-sm max-w-lg">
        <p className="mb-4">
          Frilansportalens AI-assistent er aktiv. Du kan bruke den til å skrive meldinger, lage stillingsannonser, foreslå fakturaer, og mer.
        </p>

        <div className="mb-4 p-3 rounded text-white bg-green-600">
          Status: AI er aktiv og klar til bruk
        </div>

        <Link href="/meldinger">
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
            Start assistent i meldinger
          </button>
        </Link>
      </div>
    </Layout>
  );
}
