import Head from "next/head";
import Layout from "../components/Layout";

export default function Hjelp() {
  const faqs = [
    {
      spørsmål: "Hvordan registrerer jeg en tjeneste?",
      svar: "Gå til Tjenester → Legg til ny og fyll ut skjemaet.",
    },
    {
      spørsmål: "Hvordan sender jeg en faktura?",
      svar: "Fyll ut detaljer under Faktura-siden. Systemet foreslår beløp automatisk.",
    },
    {
      spørsmål: "Hvordan fungerer AI-assistenten?",
      svar: "Den hjelper deg å skrive meldinger, annonser og tolker forespørsler – automatisk aktivert.",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Hjelpesenter | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Hjelpesenter</h1>

      <div className="space-y-6 bg-white border border-black rounded p-6 text-sm">
        {faqs.map(({ spørsmål, svar }, i) => (
          <div key={i}>
            <h2 className="font-semibold">{spørsmål}</h2>
            <p className="text-gray-700 mt-1">{svar}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
