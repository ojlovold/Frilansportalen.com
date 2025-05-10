import Head from "next/head";
import Layout from "../components/Layout";

export default function Kalender() {
  const hendelser = [
    { dato: "12.05.2025", beskrivelse: "Oppdrag for MediaHuset (Oslo)" },
    { dato: "15.05.2025", beskrivelse: "Ledig" },
    { dato: "18.05.2025", beskrivelse: "Oppdrag: Festivalvakt (Bergen)" },
  ];

  return (
    <Layout>
      <Head>
        <title>Kalender | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Din kalender</h1>

      <ul className="text-sm bg-white border border-black rounded p-4 space-y-3">
        {hendelser.map(({ dato, beskrivelse }, i) => (
          <li key={i}>
            <strong>{dato}:</strong> {beskrivelse}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
