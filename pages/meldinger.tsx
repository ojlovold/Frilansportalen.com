import Head from "next/head";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import PremiumBox from "@/components/PremiumBox";
import { brukerHarPremium } from "@/utils/brukerHarPremium";

interface Melding {
  id: string;
  avsender_id: string;
  mottaker_id: string;
  innhold: string;
  opprettet: string;
}

export default function Meldinger() {
  const { user } = useUser();
  const [meldinger, setMeldinger] = useState<Melding[]>([]);
  const [harPremium, setHarPremium] = useState(false);

  useEffect(() => {
    if (!user) return;

    const hentMeldinger = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);

      const { data, error } = await supabase
        .from("meldinger")
        .select("*")
        .or(`avsender_id.eq.${user.id},mottaker_id.eq.${user.id}`)
        .order("opprettet", { ascending: false });

      if (!error) {
        setMeldinger(data || []);
      }
    };

    hentMeldinger();
  }, [user]);

  if (!user) return <div className="p-8">Laster meldinger...</div>;

  return (
    <>
      <Head>
        <title>Meldinger | Frilansportalen</title>
        <meta name="description" content="Send og motta meldinger direkte i Frilansportalen" />
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Meldinger</h1>

        {!harPremium && <PremiumBox />}

        {meldinger.length === 0 ? (
          <p>Ingen meldinger ennå.</p>
        ) : (
          <ul className="space-y-4">
            {meldinger.map((melding) => (
              <li key={melding.id} className="p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(melding.opprettet).toLocaleString()}
                </p>
                <p className="text-lg">{melding.innhold}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
