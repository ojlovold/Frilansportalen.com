import Head from "next/head";
import Header from "../components/Header";

const hendelser = [
  { type: "Betaling", tekst: "Stillingsannonse kjøpt av bruker123", tid: "21. mai kl. 13:04" },
  { type: "Innlogging", tekst: "Admin logget inn fra ny IP", tid: "21. mai kl. 12:37" },
  { type: "Varsel", tekst: "Melding ikke levert til bruker456", tid: "20. mai kl. 18:22" },
  { type: "Feilrapport", tekst: "404-feil på /kursdetaljer", tid: "19. mai kl. 23:14" },
];

export default function Adminlogg() {
  return (
    <>
      <Head>
        <title>Systemlogg | Frilansportalen</title>
        <meta name="description" content="Se hendelser og systemstatus – kun for administrator" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Systemlogg</h1>

        <ul className="space-y-4">
          {hendelser.map((h, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{h.type}</p>
              <p>{h.tekst}</p>
              <p className="text-sm text-gray-600">{h.tid}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
