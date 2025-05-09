import Head from "next/head";
import Header from "../components/Header";

const kvitteringsdata = {
  produkt: "Stillingsannonse",
  beløp: 1000,
  dato: "2024-05-21",
  betaltMed: "Stripe",
  transaksjonsID: "txn_89xhd37a",
};

export default function Kvittering() {
  return (
    <>
      <Head>
        <title>Kvittering | Frilansportalen</title>
        <meta name="description" content="Se detaljer for betaling og transaksjoner" />
      </Head>
      <Header />
      <main className="min-h-screen bg-portalGul text-black p-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Kvittering</h1>

        <div className="bg-white p-6 rounded shadow text-left space-y-2">
          <p><strong>Produkt:</strong> {kvitteringsdata.produkt}</p>
          <p><strong>Beløp:</strong> {kvitteringsdata.beløp} kr</p>
          <p><strong>Dato:</strong> {kvitteringsdata.dato}</p>
          <p><strong>Betalt med:</strong> {kvitteringsdata.betaltMed}</p>
          <p><strong>Transaksjons-ID:</strong> {kvitteringsdata.transaksjonsID}</p>
        </div>
      </main>
    </>
  );
}
