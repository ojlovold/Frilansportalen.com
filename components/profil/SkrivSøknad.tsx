import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SkrivSøknad({
  brukerId,
  stillingId,
  stillingstittel,
}: {
  brukerId: string;
  stillingId: string;
  stillingstittel: string;
}) {
  const [tekst, setTekst] = useState("");
  const [status, setStatus] = useState("");

  const sendSøknad = async () => {
    if (!tekst.trim()) return;

    const { data: eksisterende } = await supabase
      .from("søknader")
      .select("id")
      .eq("bruker_id", brukerId)
      .eq("stilling_id", stillingId)
      .maybeSingle();

    if (eksisterende) {
      setStatus("Du har allerede søkt på denne stillingen.");
      return;
    }

    const { error } = await supabase.from("søknader").insert([
      {
        bruker_id: brukerId,
        stilling_id: stillingId,
        stillingstittel,
        tekst,
      },
    ]);

    if (error) setStatus("Noe gikk galt.");
    else {
      setTekst("");
      setStatus("Søknaden er sendt!");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Skriv søknad</h2>

      <textarea
        placeholder="Skriv din søknad her..."
        value={tekst}
        onChange={(e) => setTekst(e.target.value)}
        className="w-full border rounded p-2 min-h-[120px]"
      />

      <button
        onClick={sendSøknad}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Send søknad
      </button>

      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
}
