import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Tjenester() {
  const tilbydere = [
    { navn: "Anna Fjell", tjeneste: "Frisør (drop-in)", sted: "Bergen" },
    { navn: "Jonas B", tjeneste: "Vaskehjelp", sted: "Drammen" },
    { navn: "Emilie Design", tjeneste: "Grafisk design", sted: "Digitalt" },
  ];

  return (
    <Layout>
      <Head>
        <title>Tjenester | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Tjenestetilbydere</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tilbydere.map(({ navn, tjeneste, sted }, i) => (
          <div key={i} className="border border-black bg-white rounded-xl p-4">
            <h2 className="text-lg font-semibold">{navn}</h2>
            <p className="text-sm text-gray-600 mt-1">{tjeneste}</p>
            <p className="text-sm text-gray-600">{sted}</p>
            <Link href="#" className="text-sm underline hover:text-black mt-2 inline-block">
              Kontakt
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
