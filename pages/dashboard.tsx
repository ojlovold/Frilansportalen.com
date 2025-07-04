"use client";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Head from "next/head";
import PremiumBox from "@/components/PremiumBox";
import AutoPDFKnapp from "@/components/AutoPDFKnapp";
import Link from "next/link";

export default function Dashboard() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [navn, setNavn] = useState("");
  const [harPremium, setHarPremium] = useState<boolean | null>(null);
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [rapporter, setRapporter] = useState<any[]>([]);
  const [kjorebok, setKjorebok] = useState<any[]>([]);

  // 🚦 Sjekk om brukerens profilinfo er fullført
  useEffect(() => {
    const hentProfil = async () => {
      if (!user) return;

      const { data: profil } = await supabase
        .from("profiler")
        .select("navn")
        .eq("id", user.id)
        .single();

      if (!profil?.navn) {
        router.push("/profil-info");
      }
    };

    hentProfil();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const hentData = async () => {
      const userId = user.id;
      const overridePremium = userId === "890ebf4a-bbdc-4424-be87-341c0b34972e";

      const { data: profil } = await supabase
        .from("profiler")
        .select("navn, har_premium")
        .eq("id", user.id)
        .single();

      if (profil) {
        setNavn(profil.navn);
        const premiumverdi = profil.har_premium ?? false;
        setHarPremium(overridePremium || premiumverdi);
      } else {
        setHarPremium(overridePremium);
      }

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
  }, [user, supabase]);

  if (!user || harPremium === null) return <div className="p-8">Laster brukerdata...</div>;

  return (
    <>
      <Head>
        <title>Min profil | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Hei {navn} 👋</h1>
          <p className="text-sm text-black/70 mb-6">Velkommen tilbake til Frilansportalen</p>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] text-white shadow-lg border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-2">Fakturaer</h2>
              <p className="text-sm mb-2">Du har {fakturaer.length} fakturaer</p>
              <Link href="/faktura" className="underline text-blue-300">Send ny faktura</Link>
            </div>

            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] text-white shadow-lg border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-2">Rapporter</h2>
              <p className="text-sm mb-2">Totalt: {rapporter.length}</p>
            </div>

            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] text-white shadow-lg border border-white/10 rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-2">Kjørebok</h2>
              <p className="text-sm mb-2">Totalt: {kjorebok.length} turer</p>
            </div>
          </section>

          <section className="mt-10 space-y-4">
            {harPremium ? (
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
            ) : (
              <div className="max-w-xl mx-auto">
                <PremiumBox />
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
