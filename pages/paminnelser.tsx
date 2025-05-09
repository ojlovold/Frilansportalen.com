import Head from "next/head";
import Header from "../components/Header";

const paminnelser = [
  {
    type: "Melding ikke besvart",
    tidspunkt: "20. mai kl. 10:15",
    tiltak: "Svar på meldingen fra Ola S.",
  },
  {
    type: "Anbud ikke ferdigstilt",
    tidspunkt: "19. mai kl. 21:00",
    tiltak: "Fullfør anbudskalkulator for kunden Nordic Installasjon.",
  },
  {
    type: "Faktura mangler kvittering",
    tidspunkt: "18. mai kl. 13:45",
    tiltak: "Last opp kvittering for betaling til Studio FX.",
  },
];

export default function Paminnelser() {
  return (
    <>
      <Head>
        <title>Påminnelser | Frilansportalen</title>
        <meta name="description" content="Automatiske påminnelser for meldinger, fakturaer og oppfølging" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Påminnelser</h1>

        <ul className="space-y-4">
          {paminnelser.map((p, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{p.type}</p>
              <p>{p.tiltak}</p>
              <p className="text-sm text-gray-600">{p.tidspunkt}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
