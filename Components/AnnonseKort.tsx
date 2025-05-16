import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { leggTilFavoritt } from "@/lib/leggTilFavoritt";
import { fjernFavoritt } from "@/lib/fjernFavoritt";

export default function AnnonseKort({ annonse }: { annonse: any }) {
  const [favoritt, setFavoritt] = useState(false);
  const [favorittTeller, setFavorittTeller] = useState(annonse.favoritter || 0);
  const [brukerId, setBrukerId] = useState<string | null>(null);

  useEffect(() => {
    const hentBruker = async () => {
      const { data } = await supabase.auth.getUser();
      const id = data?.user?.id || null;
      setBrukerId(id);

      if (id) {
        const { data: eksisterende } = await supabase
          .from("favoritter")
          .select("*")
          .eq("bruker_id", id)
          .eq("annonse_id", annonse.id);

        if (eksisterende && eksisterende.length > 0) {
          setFavoritt(true);
        }
      }
    };

    hentBruker();
  }, [annonse.id]);

  const toggleFavoritt = async () => {
    if (!brukerId) return;

    if (favoritt) {
      await fjernFavoritt(brukerId, annonse.id);
      setFavoritt(false);
      setFavorittTeller((t: number) => t - 1);
    } else {
      await leggTilFavoritt(brukerId, annonse.id);
      setFavoritt(true);
      setFavorittTeller((t: number) => t + 1);
    }
  };

  const visBilde = annonse.bilder?.[0] || "/placeholder.jpg";
  const type = annonse.type || "Til salgs";

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{annonse.tittel}</h2>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded">{type}</span>
      </div>
      <p className="text-sm text-gray-700 mb-2">{annonse.beskrivelse}</p>
      <Image
        src={visBilde}
        alt="Annonsebilde"
        width={400}
        height={300}
        className="rounded-md mb-3"
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{favorittTeller} favoritter</span>
        <button
          onClick={toggleFavoritt}
          className={`px-3 py-1 rounded text-white ${
            favoritt ? "bg-red-500" : "bg-gray-500"
          }`}
        >
          {favoritt ? "Favoritt" : "Lagre"}
        </button>
      </div>
    </div>
  );
}
