import Head from "next/head";
import Header from "../components/Header";

const stillinger = [
  {
    tittel: "Webdesigner – deltid (remote)",
    firma: "Digitale Hoder AS",
    sted: "Tromsø",
    beskrivelse: "Vi søker en kreativ frilanser med erfaring innen UI/UX og frontend for småprosjekter.",
  },
  {
    tittel: "Prosjektleder – frilansbasis",
    firma: "ProsjektPartner",
    sted: "Oslo",
    beskrivelse: "Koordinering og oppfølging av tverrfaglige team innen bygg og anlegg.",
  },
];

const profiler = [
  {
    navn: "Jonas V. – React-utvikler",
    erfaring: "5 år i frilansmarkedet",
    lokasjon: "Bergen",
  },
  {
    navn: "Anita L. – Illustratør & animatør",
    erfaring: "12 år i mediebransjen",
    lokasjon: "Kristiansand",
  },
];

export default function Demodata() {
  return (
    <>
      <Head>
        <title>Demodata | Frilansportalen</title>
        <meta name="description" content="Realistiske profiler og stillinger for testing og demonstrasjon" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Demo: Profiler og stillinger</h1>

        <h2 className="text-xl font-semibold mt-4 mb-2">Stillingsannonser</h2>
        <ul className="space-y-4">
          {stillinger.map((s, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-bold">{s.tittel}</p>
              <p className="text-sm text-gray-600">{s.firma} – {s.sted}</p>
              <p>{s.beskrivelse}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-2">Frilanserprofiler</h2>
        <ul className="space-y-4">
          {profiler.map((p, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-bold">{p.navn}</p>
              <p className="text-sm text-gray-600">{p.erfaring} – {p.lokasjon}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
