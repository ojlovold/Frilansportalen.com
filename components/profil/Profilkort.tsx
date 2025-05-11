import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Profilkort({ userId }: { userId: string }) {
  const [profil, setProfil] = useState<{ navn: string; beskrivelse: string } | null>(null);
  const [navn, setNavn] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hentProfil = async () => {
      const { data } = await supabase
        .from("profiler")
        .select("navn, beskrivelse")
        .eq("bruker_id", userId)
        .single();
      if (data) {
        setProfil(data);
        setNavn(data.navn || "");
        setBeskrivelse(data.beskrivelse || "");
      }
    };
    hentProfil();
  }, [userId]);

  const lagre = async () => {
    const { error } = await supabase
      .from("profiler")
      .upsert({ bruker_id: userId, navn, beskrivelse });
    setStatus(error ? "Kunne ikke lagre" : "Lagret!");
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">Min profil</h2>
      <div>
        <label className="block">Navn:</label>
        <input
          className="w-full border p-2 rounded"
          value={navn}
          onChange={e => setNavn(e.target.value)}
        />
      </div>
      <div>
        <label className="block">Beskrivelse:</label>
        <textarea
          className="w-full border p-2 rounded"
          value={beskrivelse}
          onChange={e => setBeskrivelse(e.target.value)}
        />
      </div>
      <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
        Lagre
      </button>
      <p>{status}</p>
    </div>
  );
}
