import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import { brukerHarPremium } from "@/utils/brukerHarPremium";
import AutoPDFKnapp from "@/components/AutoPDFKnapp";
import PremiumBox from "@/components/PremiumBox";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUser();

  const [harPremium, setHarPremium] = useState(false);
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [rapporter, setRapporter] = useState<any[]>([]);
  const [kjorebok, setKjorebok] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const hentData = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);

      const { data: fakturaData } = await supabase
        .from("faktura")
        .select("*")
        .eq("bruker_id", user.id);
      setFakturaer(fakturaData || []);

      const { data: rapportData } = await supabase
        .from("rapporter")
        .select("*")
        .eq("bruker_id", user.id);
      setRapporter(rapportData || []);

      const { data: kjoreData } = await supabase
        .from("kjorebok")
        .select("*")
        .eq("bruker_id", user.id);
      setKjorebok(kjoreData || []);
    };

    hentData();
  }, [user]);

  if (!user) return <div className="p-8">Laster brukerdata...</div>;

  return (
    <>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-6">Mitt dashboard</h1>

        {!harPremium && <PremiumBox />}

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Fakturaer ({fakturaer.length})</h2>
          <Link href="/faktura" className="underline">
            Send ny faktura
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Rapporter ({rapporter.length})</h2>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Kjørebok ({kjorebok.length})</h2>
        </div>

        {harPremium && (
          <>
            <AutoPDFKnapp
              tittel="Fakturaoversikt"
              filnavn="fakturaer"
              kolonner={["Dato", "Beskrivelse", "Beløp"]}
              rader={fakturaer.map((f) => [f.dato, f.beskrivelse, `${f.belop} kr`])}
            />

            <AutoPDFKnapp
              tittel="Rapportoversikt"
              filnavn="rapporter"
              kolonner={["Dato", "Innhold"]}
              rader={rapporter.map((r) => [r.dato, r.innhold])}
            />

            <AutoPDFKnapp
              tittel="Kjørebok"
              filnavn="kjorebok"
              kolonner={["Dato", "Fra", "Til", "Kilometer"]}
              rader={kjorebok.map((k) => [k.dato, k.fra, k.til, `${k.kilometer} km`])}
            />
          </>
        )}
      </main>
    </>
  );
}
