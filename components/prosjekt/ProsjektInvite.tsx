import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  prosjektId: string;
}

export default function ProsjektInvite({ prosjektId }: Props) {
  const [sok, setSok] = useState("");
  const [resultater, setResultater] = useState<any[]>([]);
  const [rolle, setRolle] = useState("medlem");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      if (sok.length < 2) {
        setResultater([]);
        return;
      }

      const { data } = await supabase
        .from("brukerprofiler")
        .select("id, navn")
        .ilike("navn", `%${sok}%`)
        .limit(10);

      setResultater(data || []);
    };

    hent();
  }, [sok]);

  const inviter = async (brukerId: string) => {
    const { error } = await supabase.from("prosjektdeltakere").insert([
      {
        prosjekt_id: prosjektId,
        bruker_id: brukerId,
        rolle,
      },
    ]);

    setStatus(error ? "Feil ved invitasjon" : "Bruker lagt til!");
    if (!error) {
      setSok("");
      setResultater([]);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <p className="font-semibold">Inviter bruker til prosjekt</p>

      <input
        type="text"
        placeholder="Søk etter navn"
        value={sok}
        onChange={(e) => setSok(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={rolle}
        onChange={(e) => setRolle(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="medlem">Medlem</option>
        <option value="ansvarlig">Ansvarlig</option>
        <option value="observatør">Observatør</option>
      </select>

      {resultater.length > 0 && (
        <ul className="space-y-2">
          {resultater.map((r) => (
            <li key={r.id} className="flex justify-between items-center border p-2 rounded">
              <span>{r.navn}</span>
              <button
                onClick={() => inviter(r.id)}
                className="bg-black text-white px-3 py-1 rounded text-sm"
              >
                Inviter
              </button>
            </li>
          ))}
        </ul>
      )}

      {status && <p className="text-green-600">{status}</p>}
    </div>
  );
}
