import Head from "next/head";
import TilgjengelighetsBar from "@/components/globalt/TilgjengelighetsBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-portalGul text-black">
      <Head>
        <title>Frilansportalen | Velkommen</title>
      </Head>

      <TilgjengelighetsBar />

      <main className="p-8 space-y-8 pt-[60px]">
        <h1 className="text-3xl font-bold">Velkommen til Frilansportalen</h1>
        <p>
          Frilansportalen kobler frilansere, arbeidsgivere og frivillige gjennom en intelligent og åpen plattform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Opprett profil</h2>
            <p className="text-sm text-gray-700">Start med å lage din frilanser-, arbeidsgiver- eller privatprofil.</p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Se ledige stillinger</h2>
            <p className="text-sm text-gray-700">Utforsk jobber, småoppdrag og dugnader på tvers av hele landet.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
