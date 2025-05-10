import Head from "next/head";
import Layout from "../components/Layout";
import jsPDF from "jspdf";

export default function AltinnRapport() {
  const sendTilAltinn = async () => {
    const doc = new jsPDF();
    doc.text("Frilansportalen årsoppgjør", 20, 20);
    const pdf = doc.output("arraybuffer");

    const base64 = Buffer.from(pdf).toString("base64");

    const res = await fetch("/api/altinn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64pdf: base64, filename: "rapport.pdf" }),
    });

    const txt = await res.text();
    alert("Svar fra Altinn:\n" + txt);
  };

  return (
    <Layout>
      <Head>
        <title>Altinn-rapport | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Send årsoppgjør til Altinn</h1>
        <button
          onClick={sendTilAltinn}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Send rapport
        </button>
      </div>
    </Layout>
  );
}
