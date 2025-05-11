import Head from "next/head";
import Layout from "../components/Layout";

export default function Premium() {
  const kjøp = async () => {
    const res = await fetch("/api/vipps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: `premium-${Date.now()}`,
        amount: 10000, // 100 kr i øre
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Kunne ikke starte Vipps-betaling.");
    }
  };

  return (
    <Layout>
      <Head><title>Premium | Frilansportalen</title></Head>

      <div className="max-w-xl mx-auto py-10 text-center text-sm">
        <h1 className="text-2xl font-bold mb-4">Oppgrader til Premium</h1>
        <p className="mb-6 text-gray-600">
          For kun <strong>100 kr/år</strong> får du tilgang til alle funksjoner:
        </p>

        <ul className="text-left list-disc ml-6 mb-6">
          <li>AI-hjelp til meldinger, faktura og stilling</li>
          <li>PDF-generering og rapportarkiv</li>
          <li>Altinn-rapportering</li>
          <li>Kart og dokumentvarsling</li>
          <li>Filopplasting og prioritet</li>
        </ul>

        <button
          onClick={kjøp}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Kjøp Premium med Vipps
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Du bruker testbruker: 4741515280 (PIN 1236) i testversjon.
        </p>
      </div>
    </Layout>
  );
}
