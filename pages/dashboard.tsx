import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Dashboard() {
  const kort = [
    { tittel: "Meldinger", href: "/meldinger" },
    { tittel: "Fakturaer", href: "/faktura" },
    { tittel: "Stillinger", href: "/stillinger" },
    { tittel: "Tjenester", href: "/tjenester" },
    { tittel: "Gjenbruksportal", href: "/gjenbruk" },
    { tittel: "Kurs", href: "/kurs" },
    { tittel: "Reise & utlegg", href: "/reise" },
    { tittel: "Adminpanel", href: "/admin" },
  ];

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">Ditt dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kort.map(({ tittel, href }) => (
          <Link key={href} href={href} className="block bg-white border border-black rounded-xl p-6 hover:bg-gray-100 transition">
            <h2 className="text-lg font-semibold">{tittel}</h2>
            <p className="text-sm text-gray-600 mt-1">Gå til {tittel.toLowerCase()}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/" className="text-sm underline hover:text-black">
          Tilbake til forsiden
        </Link>
      </div>
    </Layout>
  );
}
