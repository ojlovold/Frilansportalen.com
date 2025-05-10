import Head from "next/head";
import Layout from "../components/Layout";

export default function Demo() {
  const tjenester = [
    { navn: "Falsk frisør", sted: "Oslo", beskrivelse: "Drop-in og timebestilling alle dager." },
    { navn: "Demorørleggeren", sted: "Bergen", beskrivelse: "Raskt og rimelig. 20 års erfaring." },
  ];

  const stillinger = [
    { tittel: "Testutvikler", type: "Oppdrag", sted: "Stavanger" },
    { tittel: "Frontend i Next.js", type: "Heltid", sted: "Remote" },
  ];

  return (
    <Layout>
      <Head>
        <title>Demomodus | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Demomodus aktiv</h1>

      <p className="text-sm mb-6 max-w-lg">
        Dette er en demonstrasjonsvisning av Frilansportalen. Innholdet du ser her er ikke ekte,
        men ment for testing, utvikling og brukervennlighetsvurdering.
      </p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Eksempel på tjenester</h2>
        <ul className="text-sm space-y-2">
          {tjenester.map((t, i) => (
            <li key={i}>
              <strong>{t.navn}</strong> ({t.sted}) – {t.beskrivelse}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Eksempel på stillinger</h2>
        <ul className="text-sm space-y-2">
          {stillinger.map((s, i) => (
            <li key={i}>
              <strong>{s.tittel}</strong> – {s.type}, {s.sted}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
