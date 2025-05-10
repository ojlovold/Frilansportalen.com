import Head from "next/head";
import Layout from "../components/Layout";

export default function Venter() {
  return (
    <Layout>
      <Head>
        <title>Frilansportalen åpner snart</title>
      </Head>

      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Frilansportalen åpner snart</h1>
        <p className="text-gray-600 text-sm mb-6">
          Vi gjør siste finpuss før lansering. Portalen er snart klar for alle brukere.
        </p>
        <p className="text-xs text-gray-400">
          Sist oppdatert: {new Date().toLocaleDateString("no-NO")}
        </p>
      </div>
    </Layout>
  );
}
