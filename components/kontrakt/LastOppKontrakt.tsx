// components/kontrakt/LastOppKontrakt.tsx
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LastOppKontrakt({ brukerId }: { brukerId: string }) {
  const [fil, setFil] = useState<File | null>(null);
  const [navn, setNavn] = useState("");
  const [status, setStatus] = useState<"klar" | "laster" | "lagret" | "feil">("klar");

  const lastOpp = async () => {
    if (!fil || !brukerId) {
      setStatus("feil");
      return;
    }

    setStatus("laster");

    const sti = `kontrakter/${brukerId}/${Date.now()}-${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("kontrakter")
      .upload(sti, fil, { upsert: true });

    if (uploadError) {
      console.error("Opplasting feilet:", uploadError.message);
      setStatus("feil");
      return;
    }

    const { data: urlData } = supabase.storage.from("kontrakter").getPublicUrl(sti);

    const { error: dbError } = await supabase.from("kontrakter").insert([
      {
        bruker_id: brukerId,
        navn: navn || fil.name,
        fil_url: urlData.publicUrl,
      },
    ]);

    if (dbError) {
      console.error("Lagring feilet:", dbError.message);
      setStatus("feil");
    } else {
      setFil(null);
      setNavn("");
      setStatus("lagret");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Last opp kontrakt</h2>

      <input
        type="text"
        placeholder="Navn på kontrakt (valgfritt)"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setFil(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={lastOpp}
        className="bg-black text-white px-4 py-2 rounded text-sm"
      >
        Last opp
      </button>

      {status === "lagret" && <p className="text-green-600 mt-2">Kontrakt lagret!</p>}
      {status === "feil" && <p className="text-red-600 mt-2">Noe gikk galt.</p>}
    </div>
  );
}
