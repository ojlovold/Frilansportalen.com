import Head from "next/head";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

const dummyTalenter = [
  { navn: "Emma Johansen", fag: "Grafisk design", sted: "Oslo" },
  { navn: "Jonas Berg", fag: "Frontend-utvikling", sted: "Bergen" },
  { navn: "Aisha Khan", fag: "Regnskap og økonomi", sted: "Trondheim" },
];

export default function TalenterPage() {
  return (
    <>
      <Head>
        <title>Talenter | Frilansportalen</title>
        <meta name="description" content="Se frilansere og arbeidssøkere på Frilansportalen" />
      </Head>

      <main className="min-h-screen bg-yellow-300 text-black p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Utforsk talentene</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Input placeholder="Søk på navn eller fag" />
            <Input placeholder="Sted (f.eks. Oslo)" />
            <select className="border border-black rounded p-2">
              <option value="">Velg stillingstype</option>
              <option value="fast">Fast stilling</option>
              <option value="sommerjobb">Sommerjobb</option>
              <option value="småjobb">Småjobb</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummyTalenter.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{t.navn}</h2>
                  <p className="mb-1">Fagfelt: {t.fag}</p>
                  <p className="text-sm text-gray-800">Lokasjon: {t.sted}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
