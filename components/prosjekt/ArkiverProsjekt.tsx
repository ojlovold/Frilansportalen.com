import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function ArkiverProsjekt({ prosjektId }: { prosjektId: string }) {
  const [laster, setLaster] = useState(false);
  const router = useRouter();

  const arkiver = async () => {
    setLaster(true);

    const { error } = await supabase
      .from("prosjekt")
      .update({ arkivert: true })
      .eq("id", prosjektId);

    setLaster(false);

    if (!error) {
      router.push("/prosjekt");
    } else {
      alert("Noe gikk galt ved arkivering.");
    }
  };

  return (
    <button
      onClick={arkiver}
      className="bg-black text-white px-4 py-2 rounded"
      disabled={laster}
    >
      {laster ? "Arkiverer..." : "Arkiver prosjekt"}
    </button>
  );
}
