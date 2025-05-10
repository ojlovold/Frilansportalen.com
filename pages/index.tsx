import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Hjem() {
  const kort = [
    { tittel: "Finn stillinger", beskrivelse: "Søk blant tilgjengelige jobber", href: "/stillinger" },
    { tittel: "Utforsk tjenester", beskrivelse: "Se hva frilansere tilbyr", href: "/tjenester" },
    { tittel: "Registrer deg", beskrivelse: "Bli en del av Frilansportalen", href: "/login" },
  ];

  return (
    <Layout>
      <Head>
        <title>Frilansportalen</title>
      </Head>

      <section className="bg-portalGul py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Velkommen til Frilansportalen</h1>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            En moderne plattform for frilansere, arbeidsgivere og tjenestetilbydere.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {kort.map(({ tittel, beskrivelse, href }, i) => (
          <Link
            href={href}
            key={i}
            className="block bg-gray-100 hover:bg-gray-200 border border-black rounded-xl p-6 transition text-center"
          >
            <h2 className="text-lg font-semibold mb-2">{tittel}</h2>
            <p className="text-sm text-gray-700">{beskrivelse}</p>
          </Link>
        ))}
      </section>
    </Layout>
  );
}
