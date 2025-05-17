import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Søknader({ userId }: { userId: string }) {
  const [søknader, setSøknader] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("søknader")
        .select("*")
        .eq("bruker_id", userId)
        .order("opprettet", { ascending: false });
      setSøknader(data || []);
    };
    hent();
  }, [userId]);

  if (!søknader.length) return <p>Ingen søknader ennå.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Mine søknader</h2>
      <ul className="space-y-2 mt-2">
        {søknader.map((s, i) => (
          <li key={i} className="border p-2 rounded bg-white text-black">
            <p><strong>Stilling:</strong> {s.stillingstittel}</p>
            <p><strong>Søknad:</strong> {s.tekst}</p>
            <p className="text-sm text-gray-500">
              {new Date(s.opprettet).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
