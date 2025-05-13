import Head from "next/head";
import Layout from "../components/Layout";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useAiAssist from "../utils/useAiAssist";
import { brukerHarPremium } from "../utils/brukerHarPremium";
import PremiumBox from "../components/PremiumBox";
import SuccessBox from "../components/SuccessBox";

export default function Fakturering() {
  const [mottaker, setMottaker] = useState("");
  const [tjeneste, setTjeneste] = useState("");
  const [belop, setBelop] = useState(0);
  const [melding, setMelding] = useState("");
  const [premium, setPremium] = useState(false);

  const { getSvar, svar, laster, feil } = useAiAssist();

  useEffect(() => {
    const sjekkPremium = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data?.user?.id;
      if (!id) return;

      const harPremium = await brukerHarPremium(id);
      setPremium(harPremium);
    };

    sjekkPremium();
  }, []);

  const foreslå = () => {
    const prompt = `Tjeneste: ${tjeneste}. Foreslå fakturatekst.`;
    getSvar(prompt, "Du er en hjelpsom fakturaassistent.");
  };

  const send = async () => {
    const { data } = await supabase.auth.getUser();
    const id = data?.user?.id;
    if (!id) return;

    const { data: profilData } = await supabase
      .from("profiler")
      .select("*")
      .eq("id", id)
      .single();

    const p = profilData;
    if (!p) return;

    const fakturanrRes = await fetch("/api/fakturanr");
    const { fakturanr } = await fakturanrRes.json();

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Faktura", 20, 20);
    doc.setFontSize(10);
    doc.text(`Fakturanr: ${fakturanr}`, 20, 28);
    doc.text(`Fra: ${p.firmanavn || p.navn}`, 20, 36);
    doc.text(`Til: ${mottaker}`, 20, 44);
    doc.text(`Tjeneste: ${tjeneste}`, 20, 52);
    doc.text(`Beløp: ${belop.toFixed(2)} kr`, 20, 60);
    doc.text(`Kontonummer: ${p.kontonr || "-"}`, 20, 68);
    doc.text(`Referanse: ${p.fakturareferanse || "-"}`, 20, 76);

    const filnavn = `faktura-${Date.now()}.pdf`;
    const pdf = doc.output("arraybuffer");

    await supabase.storage
      .from("faktura-filer")
      .upload(filnavn, pdf, {
        contentType: "application/pdf",
      });

    await supabase.from("fakturaer").insert({
      bruker_id: id,
      mottaker,
      tjeneste,
      belop,
      filnavn,
    });

    setMottaker("");
    setTjeneste("");
    setBelop(0);
    setMelding("Faktura generert og lagret!");
  };

  if (!premium) {
    return (
      <Layout>
        <Head>
          <title>Fakturering</title>
        </Head>
        <div className="max-w-xl mx-auto py-10">
          <PremiumBox />
        </div>
      </Layout>
    );
  }

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

        <div className="mb-2 flex gap-2 items-center">
          <input
            value={tjeneste}
            onChange={(e) => setTjeneste(e.target.value)}
            placeholder="Tjeneste / oppdrag"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={foreslå}
            className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-800"
          >
            Foreslå med AI
          </button>
        </div>

        {svar && (
          <p className="text-xs bg-yellow-100 border px-3 py-2 rounded text-yellow-800 mb-2">
            {svar}
          </p>
        )}
        {feil && <p className="text-xs text-red-600 mb-2">{feil}</p>}

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

        <SuccessBox melding={melding} />
      </div>
    </Layout>
  );
}
