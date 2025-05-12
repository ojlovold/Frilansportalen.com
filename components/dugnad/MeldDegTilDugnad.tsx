import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function MeldDegTilDugnad({ dugnadId }: { dugnadId: string }) {
  const user = useUser();
  const [melding, setMelding] = useState("");
  const [status, setStatus] = useState("");

  const send = async () => {
    const brukerId = user && 'id' in user ? (user.id as string) : null;
    if (!brukerId || !melding.trim()) return;

    const { error } = await supabase.from("dugnadsmeldinger").insert([
      {
        dugnad_id: dugnadId,
        bruker_id: brukerId,
        melding,
      },
    ]);

    if (!error) {
      setStatus("Melding sendt!");
      setMelding("");

      // Valgfritt: send varsling til eier (burde bruke dugnadseier_id)
      await supabase.from("varsler").insert([
        {
          bruker_id: brukerId,
          type: "dugnad",
          tekst: "Du har fått en ny melding på dugnadsoppdrag.",
          lenke: `/dugnadsportalen`,
        },
      ]);
    } else {
      setStatus("Feil ved innsending.");
    }
  };

  return (
    <div className="space-y-3 mt-6 bg-white border p-4 rounded">
      <h3 className="text-lg font-bold">Meld deg til dugnaden</h3>

      <textarea
        placeholder="Kort melding (valgfritt)"
        value={melding}
        onChange={(e) => setMelding(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
        Jeg vil bidra
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
