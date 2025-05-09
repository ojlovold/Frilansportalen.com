import Head from "next/head";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Frilansportalen</title>
        <meta name="description" content="Oversikt over din aktivitet, fakturaer og tilgjengelighet" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mitt dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Meldinger</h2>
            <p>Du har 2 nye meldinger.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Fakturaer</h2>
            <p>3 fakturaer sendt. 1 venter på betaling.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Tilgjengelighet</h2>
            <p>Du er ledig i 8 av 14 kommende dager.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Anbud</h2>
            <p>Siste kalkulerte pris: 7 400 kr.</p>
          </div>
        </div>
      </main>
    </>
  );
}
