import Head from "next/head";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import PremiumBox from "@/components/PremiumBox";
import { brukerHarPremium } from "@/utils/brukerHarPremium";

interface Epost {
  id: string;
  emne: string;
  innhold: string;
  fra: string;
  til: string;
  sendt: string;
}

export default function EpostSide() {
  const { user } = useUser();
  const [eposter, setEposter] = useState<Epost[]>([]);
  const [harPremium, setHarPremium] = useState(false);

  useEffect(() => {
    if (!user) return;

    const hentEposter = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);

      const { data, error } = await supabase
        .from("epost")
        .select("*")
        .eq("til", user.email)
        .order("sendt", { ascending: false });

      if (!error && data) {
        setEposter(data);
      }
    };

    hentEposter();
  }, [user]);

  if (!user) return <div className="p-8">Laster e-post...</div>;

  return (
    <>
      <Head>
        <title>Min e-post | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Innboks</h1>

        {!harPremium && <PremiumBox />}

        {eposter.length === 0 ? (
          <p>Ingen e-poster funnet.</p>
        ) : (
          <ul className="space-y-4">
            {eposter.map((epost) => (
              <li key={epost.id} className="p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-600">
                  Fra: {epost.fra} – {new Date(epost.sendt).toLocaleString()}
                </p>
                <h2 className="text-lg font-semibold">{epost.emne}</h2>
                <p>{epost.innhold}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
