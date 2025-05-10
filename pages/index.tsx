import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>Frilansportalen</title>
      </Head>

      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Velkommen til Frilansportalen</h1>
        <p className="text-gray-700 mb-10 text-sm">
          Plattformen for frilansere, arbeidsgivere og jobbsøkere – alt på ett sted.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/auth?rolle=frilanser">
            <div className="bg-white border border-black p-6 rounded shadow-sm hover:bg-gray-50 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Jeg er frilanser</h2>
              <p className="text-sm text-gray-600">Finn oppdrag, fakturer, bygg nettverk.</p>
            </div>
          </Link>

          <Link href="/auth?rolle=arbeidsgiver">
            <div className="bg-white border border-black p-6 rounded shadow-sm hover:bg-gray-50 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Jeg er arbeidsgiver</h2>
              <p className="text-sm text-gray-600">Publiser stillinger og finn folk.</p>
            </div>
          </Link>

          <Link href="/auth?rolle=jobbsøker">
            <div className="bg-white border border-black p-6 rounded shadow-sm hover:bg-gray-50 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Jeg søker jobb</h2>
              <p className="text-sm text-gray-600">Søk på utlysninger og bygg CV.</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
