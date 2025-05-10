import Head from "next/head";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Fakturering() {
  const [mottaker, setMottaker] = useState("");
  const [tjeneste, setTjeneste] = useState("");
  const [belop, setBelop] = useState(0);
  const [melding, setMelding] = useState("");

  const send = async () => {
    const bruker = await supabase.auth.getUser();
    const profil = await supabase.from("profiler").select("*").eq("id", bruker.data.user?.id).single();
    const p = profil.data;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Faktura", 20, 20);
    doc.setFontSize(10);
    doc.text(`Fra: ${p?.firmanavn || p?.navn}`, 20, 35);
    doc.text(`Til: ${mottaker}`, 20, 42);
    doc.text(`Tjeneste: ${tjeneste}`, 20, 50);
    doc.text(`Beløp: ${belop.toFixed(2)} kr`, 20, 58);
    doc.text(`Kontonummer: ${p?.kontonr || "-"}`, 20, 66);
    doc.text(`Referanse: ${p?.fakturareferanse || "-"}`, 20, 74);

    const filnavn = `faktura-${Date.now()}.pdf`;
    const pdf = doc.output("arraybuffer");

    await supabase.storage.from("faktura-filer").upload(filnavn, pdf, {
      contentType: "application/pdf",
    });

    await supabase.from("fakturaer").insert({
      bruker_id: p.id,
      mottaker,
      tjeneste,
      belop,
      filnavn,
    });

    setMottaker(""); setTjeneste(""); setBelop(0);
    setMelding("Faktura generert og lagret!");
  };

  return (
    <Layout>
      <Head>
        <title>Fakturering | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Send faktura</h1>

        <input
          value={mottaker}
          onChange={(e) => setMottaker(e.target.value)}
          placeholder="Mottaker"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          value={tjeneste}
          onChange={(e) => setTjeneste(e.target.value)}
          placeholder="Tjeneste / oppdrag"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="number"
          value={belop}
          onChange={(e) => setBelop(Number(e.target.value))}
          placeholder="Beløp (kr)"
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={send}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
        >
          Send faktura
        </button>

        {melding && <p className="text-green-600 text-sm mt-4">{melding}</p>}
      </div>
    </Layout>
  );
}
