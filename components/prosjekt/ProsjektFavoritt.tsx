import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function ProsjektFavoritt({ prosjektId }: { prosjektId: string }) {
  const user = useUser();
  const [favoritt, setFavoritt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("prosjektdeltakere")
        .select("favoritt")
        .eq("prosjekt_id", prosjektId)
        .eq("bruker_id", user.id)
        .single();

      setFavoritt(data?.favoritt || false);
      setLoading(false);
    };

    hent();
  }, [prosjektId, user]);

  const toggle = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("prosjektdeltakere")
      .update({ favoritt: !favoritt })
      .eq("prosjekt_id", prosjektId)
      .eq("bruker_id", user.id);

    if (!error) setFavoritt(!favoritt);
  };

  if (loading) return null;

  return (
    <button onClick={toggle} className="text-sm underline text-blue-600">
      {favoritt ? "Fjern som favoritt" : "Legg til som favoritt"}
    </button>
  );
}
