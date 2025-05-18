import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ← KORRIGERT IMPORT
import Link from "next/link";

interface Stilling {
  id: string;
  tittel: string;
  beskrivelse: string;
  krav: string;
  frist: string;
  arbeidsgiver_id: string;
  status: string;
}

export default function VisStillinger() {
  const [stillinger, setStillinger] = useState<Stilling[]>([]);
  const [sok, setSok] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("stillinger")
        .select("*")
        .eq("status", "aktiv")
        .order("frist", { ascending: true });

      setStillinger(data || []);
    };

    hent();
  }, []);

  const filtrert = stillinger.filter((s) =>
    [s.tittel, s.beskrivelse, s.krav]
      .join(" ")
      .toLowerCase()
      .includes(sok.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Ledige stillinger</h2>

      <input
        type="text"
        placeholder="Søk etter stilling, krav eller beskrivelse"
        value={sok}
        onChange={(e) => setSok(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <ul className="space-y-4">
        {filtrert.map((s) => (
          <li key={s.id} className="border p-4 rounded bg-white text-black shadow-sm">
            <p className="text-lg font-bold">{s.tittel}</p>
            <p className="text-sm text-gray-700">{s.beskrivelse}</p>
            {s.krav && <p className="text-sm text-gray-500">Krav: {s.krav}</p>}
            <p className="text-sm">Frist: {new Date(s.frist).toLocaleDateString()}</p>

            <Link
              href={`/stilling/${s.id}`}
              className="inline-block mt-2 text-blue-600 underline text-sm"
            >
              Vis stilling / Send søknad
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
