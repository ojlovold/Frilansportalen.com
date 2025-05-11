import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function ArkiverProsjekt({ prosjektId }: { prosjektId: string }) {
  const [status, setStatus] = useState("");
  const [bekreft, setBekreft] = useState(false);
  const router = useRouter();

  const arkiver = async () => {
    const { error } = await supabase
      .from("prosjekter")
      .update({ arkivert: true })
      .eq("id", prosjektId);

    setStatus(error ? "Kunne ikke arkivere" : "Prosjekt arkivert");
    if (!error) router.push("/prosjektoversikt");
  };

  const slett = async () => {
    const { error } = await supabase
      .from("prosjekter")
      .update({ slettet: true })
      .eq("id", prosjektId);

    setStatus(error ? "Kunne ikke slette" : "Prosjekt slettet");
    if (!error) router.push("/prosjektoversikt");
  };

  return (
    <div className="space-y-3 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">Arkiver eller slett prosjekt</h3>

      {!bekreft ? (
        <button onClick={() => setBekreft(true)} className="text-sm underline text-red-600">
          Vis alternativer
        </button>
      ) : (
        <>
          <button onClick={arkiver} className="bg-yellow-500 text-black px-4 py-2 rounded">
            Arkiver
          </button>
          <button onClick={slett} className="bg-red-600 text-white px-4 py-2 rounded ml-4">
            Slett permanent
          </button>
          <p className="text-sm text-gray-500">Slett skjuler prosjektet for alle, men data beholdes.</p>
        </>
      )}

      {status && <p className="text-green-600 text-sm">{status}</p>}
    </div>
  );
}
