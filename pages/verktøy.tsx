import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Verktoy() {
  const verktøy = [
    { navn: "Faktura", lenke: "/faktura", beskrivelse: "Opprett og send fakturaer enkelt" },
    { navn: "Kjørebok", lenke: "/kjorebok", beskrivelse: "Registrer turer og kalkuler godtgjørelse" },
    { navn: "MVA", lenke: "/mva", beskrivelse: "Se inntekter og fradrag måned for måned" },
    { navn: "Årsoppgjør", lenke: "/arsoppgjor", beskrivelse: "Automatisk oppstilling og skatt" },
    { navn: "PDF", lenke: "/pdf", beskrivelse: "Generer årsrapport som PDF" },
    { navn: "Altinn", lenke: "/altinn", beskrivelse: "Send rapporten til Altinn (kommer snart)" },
    { navn: "Rutekalkulator", lenke: "/rutekalkulator", beskrivelse: "Kalkuler reiseutgifter og bom" },
    { navn: "Skjemabank", lenke: "/skjema", beskrivelse: "Finn skjema og HMS-mal" },
    { navn: "Fagbibliotek", lenke: "/fagbibliotek", beskrivelse: "Les og last ned nyttig fagstoff" },
    { navn: "Rapportarkiv", lenke: "/rapportarkiv", beskrivelse: "Se lagrede rapporter og status" },
  ];

  return (
    <Layout>
      <Head>
        <title>Verktøykasse | Frilansportalen</title>
      </Head>

      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Verktøykasse</h1>

        <ul className="space-y-4 text-sm">
          {verktøy.map((v, i) => (
            <li key={i} className="bg-white border p-4 rounded shadow-sm">
              <Link href={v.lenke} className="text-lg font-semibold underline text-blue-600 hover:text-blue-800">
                {v.navn}
              </Link>
              <p className="text-gray-600">{v.beskrivelse}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
