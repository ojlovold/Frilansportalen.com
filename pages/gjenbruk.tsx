import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Gjenbruk() {
  const ting = [
    { tittel: "Sovesofa gis bort", pris: "0 kr", sted: "Bergen" },
    { tittel: "Brukt boremaskin", pris: "100 kr", sted: "Fredrikstad" },
    { tittel: "Hylle med 4 rom", pris: "Gratis", sted: "Tønsberg" },
  ];

  return (
    <Layout>
      <Head>
        <title>Gjenbruksportalen | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Gjenbruksportalen</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ting.map(({ tittel, pris, sted }, i) => (
          <div key={i} className="border border-black bg-white rounded-xl p-4">
            <h2 className="font-semibold text-lg">{tittel}</h2>
            <p className="text-sm text-gray-600 mt-1">Pris: {pris}</p>
            <p className="text-sm text-gray-600">Sted: {sted}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/gjenbruk/ny" className="underline text-sm hover:text-black">
          Legg ut ny ting
        </Link>
      </div>
    </Layout>
  );
}
