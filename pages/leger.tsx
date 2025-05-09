import Head from "next/head";
import Header from "../components/Header";

const leger = [
  {
    navn: "Oslo Helseklinikk",
    by: "Oslo",
    attester: ["Førerkort", "Sjøfartsattest", "Helseattest frilans"],
    kontakt: "kontakt@oslohelse.no",
  },
  {
    navn: "Bergen Legekontor",
    by: "Bergen",
    attester: ["Helseattest", "Sjøfolk", "Fallskjerm"],
    kontakt: "post@bergenlege.no",
  },
  {
    navn: "Attestpartner AS",
    by: "Trondheim",
    attester: ["Førerkort", "Nattarbeid", "HMS"],
    kontakt: "info@attestpartner.no",
  },
];

export default function Leger() {
  return (
    <>
      <Head>
        <title>Leger og attester | Frilansportalen</title>
        <meta name="description" content="Finn leger som tilbyr ulike typer helseattest og godkjenninger" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Attesttilbydere</h1>

        <ul className="space-y-4">
          {leger.map((lege, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{lege.navn}</h2>
              <p className="text-sm text-gray-600">{lege.by}</p>
              <p className="mb-2">Tilbyr: {lege.attester.join(", ")}</p>
              <p className="text-sm"><strong>Kontakt:</strong> {lege.kontakt}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
