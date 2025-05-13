import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { brukerHarPremium } from "../utils/brukerHarPremium";
import PremiumBox from "../components/PremiumBox";

export default function Altinn() {
  const [data, setData] = useState<any>({ inntekt: 0, fradrag: 0, kjore: 0 });
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const hentAltinnData = async () => {
      const { data: brukerData, error } = await supabase.auth.getUser();
      const id = brukerData?.user?.id;

      if (!id) return;

      const harPremium = await brukerHarPremium(id);
      setPremium(harPremium);

      const { data: mva } = await supabase
        .from("mva")
        .select("inntekt, fradrag")
        .eq("bruker_id", id);

      const { data: kjore } = await supabase
        .from("kjorebok")
        .select("km, sats")
        .eq("bruker_id", id);

      const inntekt = mva?.reduce((acc, r) => acc + Number(r.inntekt || 0), 0) || 0;
      const fradrag = mva?.reduce((acc, r) => acc + Number(r.fradrag || 0), 0) || 0;
      const kjoresum = kjore?.reduce((acc, r) => acc + (r.km * r.sats), 0) || 0;

      setData({
        inntekt,
        fradrag,
        kjore: kjoresum,
      });
    };

    hentAltinnData();
  }, []);

  const grunnlag = data.inntekt - data.fradrag - data.kjore;
  const skatt = grunnlag * 0.22;

  const sendTilAltinn = () => {
    alert("Simulert innsending til Altinn. Ekte integrasjon er aktiv når du har Premium.");
  };

  if (!premium) {
    return (
      <Layout>
        <Head><title>Altinn</title></Head>
        <div className="max-w-xl mx-auto py-10"><PremiumBox /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Rapporter til Altinn | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Send rapport til Altinn</h1>

        <ul className="text-sm space-y-2 mb-6">
          <li>Total inntekt: <strong>{data.inntekt.toFixed(2)} kr</strong></li>
          <li>Fradrag: <strong>{data.fradrag.toFixed(2)} kr</strong></li>
          <li>Kjøregodtgjørelse: <strong>{data.kjore.toFixed(2)} kr</strong></li>
          <li>Skattbart grunnlag: <strong>{grunnlag.toFixed(2)} kr</strong></li>
          <li>Anslått skatt: <strong>{skatt.toFixed(2)} kr</strong></li>
        </ul>

        <button
          onClick={sendTilAltinn}
          className="bg-black text-white px-6 py-3 rounded text-sm hover:bg-gray-800"
        >
          Send til Altinn
        </button>
      </div>
    </Layout>
  );
}
