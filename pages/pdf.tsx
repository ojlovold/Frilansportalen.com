import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PDF() {
  const [data, setData] = useState<any>({
    inntekt: 0,
    fradrag: 0,
    kjore: 0,
  });

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data: mva } = await supabase.from("mva").select("inntekt, fradrag").eq("bruker_id", id);
      const { data: kjore } = await supabase.from("kjorebok").select("km, sats").eq("bruker_id", id);

      const inntektTotal = mva?.reduce((acc, r) => acc + Number(r.inntekt || 0), 0);
      const fradragTotal = mva?.reduce((acc, r) => acc + Number(r.fradrag || 0), 0);
      const kjoreSum = kjore?.reduce((acc, r) => acc + (r.km * r.sats), 0);

      setData({
        inntekt: inntektTotal || 0,
        fradrag: fradragTotal || 0,
        kjore: kjoreSum || 0,
      });
    };

    hent();
  }, []);

  const lastNed = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Årsoppgjør", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Beskrivelse", "Beløp"]],
      body: [
        ["Total inntekt", `${data.inntekt.toFixed(2)} kr`],
        ["Fradrag", `${data.fradrag.toFixed(2)} kr`],
        ["Kjøregodtgjørelse", `${data.kjore.toFixed(2)} kr`],
        ["Skattbart grunnlag", `${(data.inntekt - data.fradrag - data.kjore).toFixed(2)} kr`],
        ["Anslått skatt (22%)", `${((data.inntekt - data.fradrag - data.kjore) * 0.22).toFixed(2)} kr`],
      ],
    });

    doc.save("arsoppgjor.pdf");
  };

  return (
    <Layout>
      <Head>
        <title>Eksporter PDF | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Eksporter årsoppgjør</h1>

        <button
          onClick={lastNed}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Last ned PDF
        </button>
      </div>
    </Layout>
  );
}
