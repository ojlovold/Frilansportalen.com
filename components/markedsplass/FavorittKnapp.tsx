import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart, HeartOff } from "lucide-react";

export default function FavorittKnapp({ annonseId }: { annonseId: string }) {
  const user = useUser();
  const [favoritt, setFavoritt] = useState(false);

  useEffect(() => {
    const sjekkFavoritt = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("favoritter")
        .select("*")
        .eq("bruker_id", user.id)
        .eq("annonse_id", annonseId);
      setFavoritt(!!data?.length);
    };
    sjekkFavoritt();
  }, [user, annonseId]);

  const toggleFavoritt = async () => {
    if (!user) return;
    if (favoritt) {
      await supabase
        .from("favoritter")
        .delete()
        .eq("bruker_id", user.id)
        .eq("annonse_id", annonseId);
    } else {
      await supabase.from("favoritter").insert({
        bruker_id: user.id,
        annonse_id: annonseId,
      });
    }
    setFavoritt(!favoritt);
  };

  return (
    <button
      onClick={toggleFavoritt}
      className={`ml-auto text-red-600 hover:text-red-800 transition ${favoritt ? "scale-110" : "opacity-70"}`}
      title={favoritt ? "Fjern fra favoritter" : "Legg til favoritt"}
    >
      {favoritt ? <Heart /> : <HeartOff />}
    </button>
  );
}
