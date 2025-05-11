import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface Melding {
  id: string;
  avsender_id: string;
  innhold: string;
  opprettet: string;
}

export default function ProsjektChat({ prosjektId }: { prosjektId: string }) {
  const user = useUser();
  const [meldinger, setMeldinger] = useState<Melding[]>([]);
  const [nyMelding, setNyMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektmeldinger")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("opprettet");

      setMeldinger(data || []);
    };

    hent();
    const intervall = setInterval(hent, 5000); // poll hvert 5. sekund
    return () => clearInterval(intervall);
  }, [prosjektId]);

  const send = async () => {
    if (!nyMelding.trim() || !user) return;

    const { error } = await supabase.from("prosjektmeldinger").insert([
      {
        prosjekt_id: prosjektId,
        avsender_id: user.id,
        innhold: nyMelding,
      },
    ]);

    if (!error) {
      setNyMelding("");
    }
  };

  return (
    <div className="space-y-4 mt-10 bg-white p-4 border rounded">
      <h3 className="text-lg font-bold">Prosjektchat</h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {meldinger.map((m) => (
          <div key={m.id} className="bg-gray-100 p-2 rounded text-sm">
            <p><strong>{m.avsender_id}</strong></p>
            <p>{m.innhold}</p>
            <p className="text-xs text-gray-500">{new Date(m.opprettet).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={nyMelding}
          onChange={(e) => setNyMelding(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Skriv melding..."
        />
        <button onClick={send} className="bg-black text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
