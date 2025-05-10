import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Hjem() {
  const roller = [
    { tittel: "Frilanser", tekst: "Opprett tjeneste, bygg profil og ta oppdrag", href: "/tjenester/ny" },
    { tittel: "Arbeidsgiver", tekst: "Publiser stillinger og finn kandidater", href: "/stillinger" },
    { tittel: "Jobbsøker", tekst: "Utforsk ledige oppdrag og send søknad", href: "/stillinger" },
    { tittel: "Gjenbruksportalen", tekst: "Finn eller del gratis utstyr og ressurser", href: "/gjenbruk" },
    { tittel: "Marked", tekst: "Tjenester, verktøy og utstyr fra brukere", href: "/marked" },
  ];

  return (
    <Layout>
      <Head>
        <title>Frilansportalen</title>
      </Head>

      <section className="bg-portalGul py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Velkommen til Frilansportalen</h1>
          <p className="text-sm text-black max-w-xl mx-auto">
            Plattformen der arbeid møter frilans. Opprett tjenester, finn oppdrag eller del utstyr – alt på ett sted.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {roller.map(({ tittel, tekst, href }, i) => (
          <Link
            href={href}
            key={i}
            className="block bg-gray-100 hover:bg-gray-200 border border-black rounded-xl p-6 transition shadow text-center"
          >
            <h2 className="text-lg font-semibold mb-2">{tittel}</h2>
            <p className="text-sm text-gray-700">{tekst}</p>
          </Link>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard" className="block bg-gray-100 hover:bg-gray-200 border border-black rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <p className="text-sm text-gray-700">Din aktivitet, varsler og dokumenter</p>
        </Link>
        <Link href="/faktura" className="block bg-gray-100 hover:bg-gray-200 border border-black rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Opprett faktura</h2>
          <p className="text-sm text-gray-700">Send faktura uten regnskapsprogram</p>
        </Link>
        <Link href="/ai" className="block bg-gray-100 hover:bg-gray-200 border border-black rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">AI-assistent</h2>
          <p className="text-sm text-gray-700">Få hjelp med tekst, meldinger og anbud</p>
        </Link>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-14 mb-20 text-sm text-gray-800">
        <h2 className="text-xl font-bold mb-3">Hva tilbyr Frilansportalen?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Stillingsmarked for frilansoppdrag og tjenester</li>
          <li>Direkte fakturering og dokumentarkiv</li>
          <li>AI-basert assistent for tekst og søknad</li>
          <li>Regnskapsfunksjoner og kjørebok</li>
          <li>Gratis gjenbruksmarked og utstyrsdeling</li>
          <li>Full sikkerhet og null mellomledd</li>
        </ul>
      </section>
    </Layout>
  );
}
