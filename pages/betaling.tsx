import Head from "next/head";
import Layout from "../components/Layout";

export default function Betaling() {
  return (
    <Layout>
      <Head>
        <title>Betaling og status | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Betaling og abonnement</h1>

        <div className="bg-white border p-4 rounded shadow-sm text-sm space-y-4">
          <div>
            <p><strong>Status:</strong> Vipps er ikke på plass enda, men vil bli det snart.</p>
            <p><strong>Stripe:</strong> Integrasjon er forberedt – aktiveres ved behov.</p>
          </div>

          <div className="pt-2 border-t">
            <p>
              Når betalingsløsning er aktivert, vil du kunne kjøpe Premium (100 kr/år) eller
              legge ut annonser med betaling.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Alt knyttes til organisasjonsnummer 935411343.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
