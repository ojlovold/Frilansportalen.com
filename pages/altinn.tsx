import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Altinn() {
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

  const sendTilAltinn = () => {
    alert("Simulert innsending til Altinn. Integrasjon kobles på senere.");
  };

  const grunnlag = data.inntekt - data.fradrag - data.kjore;
  const skatt = grunnlag * 0.22;

  return (
    <Layout>
      <Head>
        <title>Rapporter til Altinn | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Rapporter til Altinn</h1>

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
