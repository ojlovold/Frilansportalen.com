import Head from "next/head";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function Kvittering() {
  return (
    <Layout>
      <Head>
        <title>Kvittering | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-20 text-center text-sm">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Takk for kjøpet!</h1>
        <p className="mb-4">Du har nå Premium-tilgang til hele Frilansportalen.</p>
        <p>Alle funksjoner er åpnet og klare til bruk.</p>

        <Link href="/dashboard" className="text-blue-600 underline mt-6 inline-block hover:text-blue-800">
          Gå til dashboard
        </Link>
      </div>
    </Layout>
  );
}
