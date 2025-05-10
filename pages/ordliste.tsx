import Head from "next/head";
import Layout from "../components/Layout";

export default function Ordliste() {
  const begreper = [
    {
      ord: "Frilanser",
      definisjon: "En person som jobber selvstendig uten fast ansettelse.",
    },
    {
      ord: "Faktura",
      definisjon: "Et betalingskrav fra deg til en kunde for utført arbeid.",
    },
    {
      ord: "Oppdrag",
      definisjon: "Et arbeid som skal utføres innen et avtalt omfang og tidsrom.",
    },
    {
      ord: "Kjørebok",
      definisjon: "En oversikt over kjørte kilometer med bil i jobbsammenheng.",
    },
    {
      ord: "MVA",
      definisjon: "Merverdiavgift – en avgift du legger på prisen du fakturerer.",
    },
    {
      ord: "Årsoppgjør",
      definisjon: "Regnskapsoppsummering for hele året som sendes til myndighetene.",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Ordliste | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Ordliste</h1>

      <ul className="space-y-4 text-sm max-w-xl bg-white border border-black p-6 rounded">
        {begreper.map((b, i) => (
          <li key={i}>
            <p className="font-semibold">{b.ord}</p>
            <p className="text-gray-700">{b.definisjon}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
