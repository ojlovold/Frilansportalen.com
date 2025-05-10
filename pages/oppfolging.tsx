import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Oppfolging() {
  const oppgaver = [
    {
      tittel: "Send faktura",
      beskrivelse: "Du har fakturaer som ikke er sendt eller betalt.",
      lenke: "/faktura",
    },
    {
      tittel: "Lever MVA",
      beskrivelse: "Siste innleverte MVA-periode er eldre enn 2 måneder.",
      lenke: "/mva",
    },
    {
      tittel: "Sjekk årsoppgjør",
      beskrivelse: "Du har ikke levert årsoppgjør for inneværende år.",
      lenke: "/arsoppgjor",
    },
    {
      tittel: "Oppdater profil",
      beskrivelse: "Mangler rolle, bilde eller kontaktinformasjon.",
      lenke: "/profil/oppdater",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Oppfølging | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Personlig oppfølging</h1>

      <ul className="space-y-6 text-sm max-w-xl bg-white border border-black p-6 rounded">
        {oppgaver.map((oppg, i) => (
          <li key={i} className="flex flex-col">
            <p className="font-semibold">{oppg.tittel}</p>
            <p className="text-gray-700 mb-1">{oppg.beskrivelse}</p>
            <Link
              href={oppg.lenke}
              className="text-blue-600 underline hover:text-blue-800 text-xs"
            >
              Gå til side
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
