import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Plan() {
  const trinn = [
    {
      tittel: "1. Opprett profil",
      tekst: "Registrer deg og legg inn navn, bilde og rolle.",
      lenke: "/profil/oppdater",
    },
    {
      tittel: "2. Send første faktura",
      tekst: "Lag din første faktura og legg til vedlegg.",
      lenke: "/faktura/ny-faktura",
    },
    {
      tittel: "3. Opprett en tjeneste",
      tekst: "Vis deg frem og bli funnet av arbeidsgivere.",
      lenke: "/tjenester/ny",
    },
    {
      tittel: "4. Meld deg på stillinger",
      tekst: "Søk relevante oppdrag og prosjekter.",
      lenke: "/stillinger",
    },
    {
      tittel: "5. Bruk AI-assistent",
      tekst: "Få hjelp til tekster og anbudsberegning.",
      lenke: "/ai",
    },
    {
      tittel: "6. Følg med i dashboard",
      tekst: "Se varsler, meldinger og regnskap på ett sted.",
      lenke: "/dashboard",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Plan | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Din startplan</h1>

      <ul className="space-y-6 text-sm bg-white border border-black p-6 max-w-xl rounded">
        {trinn.map((t, i) => (
          <li key={i} className="flex flex-col">
            <span className="font-semibold">{t.tittel}</span>
            <span className="text-gray-700 mb-1">{t.tekst}</span>
            <Link href={t.lenke} className="text-blue-600 underline text-xs">
              Gå til side
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
