// Fil: /components/prosjekt/OpprettProsjekt.tsx

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function OpprettProsjekt() {
  const user = useUser();
  const router = useRouter();

  const [navn, setNavn] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [status, setStatus] = useState("");

  const opprett = async () => {
    const brukerId = user && "id" in user ? (user.id as string) : null;
    if (!navn || !brukerId) return;

    setStatus("Oppretter prosjekt...");

    const { error } = await supabase.from("prosjekt").insert([
      {
        navn,
        beskrivelse,
        opprettet_av: brukerId,
        status: "aktiv",
      },
    ]);

    if (error) {
      setStatus("Noe gikk galt ved oppretting.");
    } else {
      setStatus("Prosjekt opprettet!");
      router.push("/prosjekt");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Opprett nytt prosjekt</h2>
      <input
        type="text"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
        placeholder="Prosjektnavn"
        className="w-full border p-2 rounded"
      />
      <textarea
        value={beskrivelse}
        onChange={(e) => setBeskrivelse(e.target.value)}
        placeholder="Beskrivelse (valgfritt)"
        className="w-full border p-2 rounded h-32"
      />
      <button
        onClick={opprett}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Opprett prosjekt
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
