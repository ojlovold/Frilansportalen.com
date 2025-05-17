import Head from "next/head";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";
import PremiumBox from "@/components/PremiumBox";
import { brukerHarPremium } from "@/utils/brukerHarPremium";

export default function NyAnnonse() {
  const { user } = useUser();
  const router = useRouter();
  const [tittel, setTittel] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [kategori, setKategori] = useState("");
  const [harPremium, setHarPremium] = useState(false);
  const [feilmelding, setFeilmelding] = useState("");
  const [lagret, setLagret] = useState(false);

  const sendInn = async () => {
    if (!user) return;
    if (!tittel || !beskrivelse || !kategori) {
      setFeilmelding("Alle felt må fylles ut");
      return;
    }

    const har = await brukerHarPremium(user.id);
    setHarPremium(har);

    const { error } = await supabase.from("annonser").insert([
      {
        tittel,
        beskrivelse,
        kategori,
        bruker_id: user.id,
        opprettet: new Date().toISOString(),
        publisert: false,
      },
    ]);

    if (error) {
      setFeilmelding("Noe gikk galt ved lagring.");
    } else {
      setLagret(true);
      router.push("/dashboard");
    }
  };

  if (!user) return <div className="p-8">Laster brukerinfo...</div>;

  return (
    <>
      <Head>
        <title>Ny annonse | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8">
        <h1 className="text-3xl font-bold mb-4">Opprett ny annonse</h1>

        {!harPremium && <PremiumBox />}

        <div className="space-y-4 max-w-xl">
          <input
            type="text"
            placeholder="Tittel"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Beskrivelse"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            className="w-full p-2 border rounded h-32"
          />
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Velg kategori</option>
            <option value="fast">Fast stilling</option>
            <option value="sommerjobb">Sommerjobb</option>
            <option value="småjobb">Småjobb</option>
            <option value="frilans">Frilansoppdrag</option>
          </select>

          {feilmelding && <p className="text-red-600">{feilmelding}</p>}

          <button
            onClick={sendInn}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Lagre annonse
          </button>
        </div>
      </main>
    </>
  );
}
