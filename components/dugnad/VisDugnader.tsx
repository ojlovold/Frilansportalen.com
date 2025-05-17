import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Dugnad {
  id: string;
  tittel: string;
  beskrivelse: string;
}

export default function VisDugnader() {
  const [dugnader, setDugnader] = useState<Dugnad[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from("dugnader")
        .select("*")
        .order("opprettet", { ascending: false });

      if (error) {
        setStatus("Feil ved henting: " + error.message);
      } else {
        setDugnader(data || []);
      }
    };

    hent();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Aktive dugnader</h2>

      {status && <p className="text-red-600 mb-4">{status}</p>}

      {dugnader.length === 0 ? (
        <p>Ingen dugnader funnet.</p>
      ) : (
        <ul className="space-y-4">
          {dugnader.map((dugnad) => (
            <li key={dugnad.id} className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-bold">{dugnad.tittel}</h3>
              <p>{dugnad.beskrivelse}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
