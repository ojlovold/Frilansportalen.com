import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Arsoppgjor() {
  const [sumInntekt, setSumInntekt] = useState(0);
  const [sumFradrag, setSumFradrag] = useState(0);
  const [kjorebok, setKjorebok] = useState(0);

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;

      const { data: mva } = await supabase
        .from("mva")
        .select("inntekt, fradrag")
        .eq("bruker_id", id);

      const { data: kmLogg } = await supabase
        .from("kjorebok")
        .select("km, sats")
        .eq("bruker_id", id);

      const inntektTotal = mva?.reduce((acc, r) => acc + Number(r.inntekt || 0), 0);
      const fradragTotal = mva?.reduce((acc, r) => acc + Number(r.fradrag || 0), 0);
      const kjoreSum = kmLogg?.reduce((acc, r) => acc + (r.km * r.sats), 0);

      setSumInntekt(inntektTotal || 0);
      setSumFradrag(fradragTotal || 0);
      setKjorebok(kjoreSum || 0);
    };

    hent();
  }, []);

  const skattbart = sumInntekt - sumFradrag - kjorebok;
  const skatt = skattbart * 0.22;

  return (
    <Layout>
      <Head>
        <title>Årsoppgjør | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Årsoppgjør</h1>

        <ul className="space-y-3 text-sm">
          <li>Total inntekt: <strong>{sumInntekt.toFixed(2)} kr</strong></li>
          <li>Fradrag: <strong>{sumFradrag.toFixed(2)} kr</strong></li>
          <li>Kjøregodtgjørelse: <strong>{kjorebok.toFixed(2)} kr</strong></li>
          <li className="mt-2 border-t pt-3">Skattbart grunnlag: <strong>{skattbart.toFixed(2)} kr</strong></li>
          <li>Forventet skatt (22%): <strong>{skatt.toFixed(2)} kr</strong></li>
        </ul>
      </div>
    </Layout>
  );
}
