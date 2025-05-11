import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function EpostInnboks({ brukerId }: { brukerId: string }) {
  const [meldinger, setMeldinger] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("epost")
        .select("*")
        .or(`til.eq.${brukerId},fra.eq.${brukerId}`)
        .order("opprettet", { ascending: false });
      setMeldinger(data || []);
    };
    hent();
  }, [brukerId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Innboks</h2>
      {meldinger.length === 0 ? (
        <p>Du har ingen e-postmeldinger ennå.</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {meldinger.map((m, i) => (
            <li key={i} className="border p-3 rounded bg-white text-black">
              <p><strong>Fra:</strong> {m.fra}</p>
              <p><strong>Til:</strong> {m.til}</p>
              <p><strong>Emne:</strong> {m.emne}</p>
              <p className="mt-2">{m.innhold}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(m.opprettet).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
