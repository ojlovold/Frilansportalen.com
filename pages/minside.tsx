import Head from "next/head";
import Header from "../components/Header";

export default function MinSide() {
  return (
    <>
      <Head>
        <title>Min side | Frilansportalen</title>
        <meta name="description" content="Din profil, dine kjøp, fakturaer og filer – samlet på ett sted" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Min side</h1>

        <div className="grid gap-4">
          <a href="/profil" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Profil</strong><br />
            Endre beskrivelse, synlighet og CV.
          </a>

          <a href="/faktura" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Fakturaer</strong><br />
            Send og se status på fakturaer.
          </a>

          <a href="/favoritter" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Mine favoritter</strong><br />
            Stillinger, tjenester og kurs du har lagret.
          </a>

          <a href="/arkiv" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Filarkiv</strong><br />
            Dokumenter, kontrakter og opplastede filer.
          </a>

          <a href="/kurs" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Kurs</strong><br />
            Dine kurs og anbefalinger.
          </a>

          <a href="/betaling" className="block bg-white p-4 rounded shadow hover:bg-gray-100">
            <strong>Betaling og kjøp</strong><br />
            Se hva du har betalt for og last ned kvitteringer.
          </a>
        </div>
      </main>
    </>
  );
}
