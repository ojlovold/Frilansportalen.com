import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Stillinger() {
  const annonser = [
    { tittel: "Frilanser søkes til videoproduksjon", arbeidsgiver: "MediaHuset", sted: "Oslo" },
    { tittel: "Byggvakt for festival", arbeidsgiver: "EventPartner", sted: "Stavanger" },
    { tittel: "Illustratør til barnebok", arbeidsgiver: "Forlag1", sted: "Digitalt" },
  ];

  return (
    <Layout>
      <Head>
        <title>Stillinger | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Stillingsannonser</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {annonser.map(({ tittel, arbeidsgiver, sted }, i) => (
          <div key={i} className="border border-black bg-white rounded-xl p-4">
            <h2 className="text-lg font-semibold">{tittel}</h2>
            <p className="text-sm text-gray-600 mt-1">{arbeidsgiver}</p>
            <p className="text-sm text-gray-600">{sted}</p>
            <Link href="#" className="text-sm underline hover:text-black mt-2 inline-block">
              Les mer
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
