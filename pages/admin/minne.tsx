import Head from "next/head";
import Layout from "../../components/Layout";

export default function Minne() {
  const punkter = [
    "Alle moduler bygges parallelt – ikke på forespørsel.",
    "Alle leveranser skal være komplette, med plassering.",
    "PDF-eksport, tale, Altinn og kjørebok er innebygd.",
    "Profil skal støtte synlighetsnivå, forespørsler og roller.",
    "Frilansere og jobbsøkere skilles i visning og systemlogikk.",
    "Ingen funksjon skal utsettes – alt skal være på plass.",
    "Filopplasting, påminnelser, API-er og varsler er inne.",
    "Brukeren skal aldri måtte etterspørre det som mangler.",
  ];

  return (
    <Layout>
      <Head>
        <title>Systemminne | Admin | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">AI-prosjektminne</h1>

      <p className="text-sm max-w-2xl mb-4">
        Dette er en oversikt over systemets interne prosjektminne slik det er lagret i Frilansportalen. Denne
        informasjonen brukes av AI-modulene og utviklingsteamet til å overholde kravene i prosjektet.
      </p>

      <ul className="text-sm space-y-2 bg-white border border-black rounded p-6 max-w-2xl">
        {punkter.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </Layout>
  );
}
