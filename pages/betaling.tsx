import Head from "next/head";
import Layout from "../components/Layout";

export default function Betaling() {
  const vippsAktiv = false;
  const stripeAktiv = false;

  return (
    <Layout>
      <Head>
        <title>Betaling | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Betalingsstatus</h1>

      {!vippsAktiv && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-4">
          Vipps er ikke aktivert ennå. Denne funksjonen blir snart tilgjengelig.
        </div>
      )}

      {!stripeAktiv && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-sm text-yellow-800 mb-4">
          Stripe er ikke aktivert ennå. Denne funksjonen blir snart tilgjengelig.
        </div>
      )}

      <div className="bg-white border border-black rounded p-4 text-sm">
        <p>Faktura #F2024-002 – 1 850 kr – <strong>Venter på betaling</strong></p>
        <p>Faktura #F2024-004 – 7 400 kr – <strong>Ikke sendt</strong></p>
      </div>
    </Layout>
  );
}
