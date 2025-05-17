import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Fakturainnstillinger({ brukerId }: { brukerId: string }) {
  const [konto, setKonto] = useState("");
  const [kontaktinfo, setKontaktinfo] = useState("");
  const [mal, setMal] = useState("Standard");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("fakturainnstillinger")
        .select("*")
        .eq("bruker_id", brukerId)
        .single();

      if (data) {
        setKonto(data.kontonummer || "");
        setKontaktinfo(data.kontaktinfo || "");
        setMal(data.mal || "Standard");
      }
    };
    hent();
  }, [brukerId]);

  const lagre = async () => {
    const { error } = await supabase.from("fakturainnstillinger").upsert({
      bruker_id: brukerId,
      kontonummer: konto,
      kontaktinfo,
      mal,
    });

    setStatus(error ? "Feil ved lagring" : "Innstillinger lagret");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Fakturainnstillinger</h2>

      <div>
        <label className="block">Kontonummer</label>
        <input
          className="w-full border p-2 rounded"
          value={konto}
          onChange={(e) => setKonto(e.target.value)}
        />
      </div>

      <div>
        <label className="block">Kontaktinformasjon</label>
        <input
          className="w-full border p-2 rounded"
          value={kontaktinfo}
          onChange={(e) => setKontaktinfo(e.target.value)}
        />
      </div>

      <div>
        <label className="block">Fakturamal</label>
        <select
          className="w-full border p-2 rounded"
          value={mal}
          onChange={(e) => setMal(e.target.value)}
        >
          <option>Standard</option>
          <option>Moderne</option>
          <option>Minimalistisk</option>
        </select>
      </div>

      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre
      </button>

      <p>{status}</p>
    </div>
  );
}
