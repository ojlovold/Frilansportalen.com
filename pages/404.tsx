import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Feilside() {
  return (
    <Layout>
      <Head>
        <title>Side ikke funnet | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">404 – Siden finnes ikke</h1>
        <p className="text-sm text-gray-600 mb-6">
          Det ser ut som du prøvde å åpne en side som ikke eksisterer eller er flyttet.
        </p>

        <Link href="/" className="text-blue-600 underline text-sm hover:text-blue-800">
          Gå til forsiden
        </Link>
      </div>
    </Layout>
  );
}
