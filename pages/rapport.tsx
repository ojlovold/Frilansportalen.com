import Head from "next/head";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import { supabase } from "../utils/supabaseClient";

export default function Rapport() {
  const sendOgLagre = async () => {
    const doc = new jsPDF();
    doc.text("Årsrapport fra Frilansportalen", 20, 20);
    const pdf = doc.output("arraybuffer");
    const base64 = Buffer.from(pdf).toString("base64");
    const filnavn = `arsrapport-${Date.now()}.pdf`;

    // Lagre i Supabase storage
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;

    await supabase.storage.from("faktura-filer").upload(filnavn, pdf, {
      contentType: "application/pdf",
    });

    // Send til Altinn
    const res = await fetch("/api/altinn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64pdf: base64, filename: filnavn }),
    });

    const svar = await res.text();
    alert("PDF lagret og sendt:\n" + svar);
  };

  return (
    <Layout>
      <Head>
        <title>Send rapport | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Eksportér årsrapport</h1>
        <button
          onClick={sendOgLagre}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Send til Altinn og lagre
        </button>
      </div>
    </Layout>
  );
}
