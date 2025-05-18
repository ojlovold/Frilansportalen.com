import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function SendSøknad({ stillingId }: { stillingId: string }) {
  const user = useUser();
  const [melding, setMelding] = useState("");
  const [status, setStatus] = useState("");

  const brukerId = user && "id" in user ? (user.id as string) : null;

  const send = async () => {
    if (!brukerId) return;

    const { error } = await supabase.from("søknader").insert([
      {
        bruker_id: brukerId,
        stilling_id: stillingId,
        melding,
      },
    ]);

    setStatus(error ? "Feil ved innsending" : "Søknad sendt!");
    if (!error) setMelding("");
  };

  const les = (tekst: string) => {
    if (typeof window !== "undefined" && window.lesTekst) {
      window.lesTekst(tekst);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded">
      <h2 className="text-lg font-bold">Send søknad</h2>

      <label
        className="font-semibold block"
        onMouseEnter={() => les("Melding eller motivasjonstekst")}
      >
        Melding eller motivasjonstekst
      </label>
      <textarea
        value={melding}
        onChange={(e) => setMelding(e.target.value)}
        className="w-full border p-2 rounded min-h-[120px]"
        onFocus={() => les("Skriv meldingen din her")}
      />

      <button
        onClick={send}
        onMouseEnter={() => les("Send søknad")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Send søknad
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
