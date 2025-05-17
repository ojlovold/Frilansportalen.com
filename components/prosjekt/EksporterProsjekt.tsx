import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EksporterProsjekt({ prosjektId }: { prosjektId: string }) {
  const [status, setStatus] = useState("");

  const eksporter = async () => {
    setStatus("Eksporterer...");

    const { data, error } = await supabase
      .from("prosjekt")
      .select("*")
      .eq("id", prosjektId)
      .single();

    if (error || !data) {
      setStatus("Feil ved eksport.");
      return;
    }

    console.log("Prosjektdata:", data);
    setStatus("Eksport fullført.");
    // Her kan du utvide med PDF-eksport eller nedlasting
  };

  return (
    <div>
      <button
        onClick={eksporter}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Eksporter prosjekt
      </button>
      <p className="mt-2 text-sm text-gray-700">{status}</p>
    </div>
  );
}
