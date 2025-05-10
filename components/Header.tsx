import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Dashboard() {
  const kort = [
    { tittel: "Meldinger", tekst: "Du har 2 nye meldinger.", href: "/meldinger" },
    { tittel: "Fakturaer", tekst: "3 fakturaer sendt. 1 venter på betaling.", href: "/faktura" },
    { tittel: "Tilgjengelighet", tekst: "Du er ledig i 8 av 14 kommende dager.", href: "/kalender" },
    { tittel: "Anbud", tekst: "Siste kalkulerte pris: 7 400 kr.", href: "/anbud" },
  ];

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Mitt dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kort.map(({ tittel, tekst, href }, i) => (
          <Link
            href={href}
            key={i}
            className="block bg-white border border-black rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold mb-1">{tittel}</h2>
            <p className="text-sm text-gray-700">{tekst}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
