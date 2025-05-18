import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Oppgave {
  id: string;
  tittel: string;
  beskrivelse: string;
  status: string;
  frist: string;
  ansvarlig_id: string;
}

export default function OppgaveListe({ prosjektId }: { prosjektId: string }) {
  const [oppgaver, setOppgaver] = useState<Oppgave[]>([]);
  const [brukere, setBrukere] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: oppg } = await supabase
        .from("prosjektoppgaver")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("frist", { ascending: true });

      const { data: delt } = await supabase
        .from("prosjektdeltakere")
        .select("*, bruker:brukerprofiler(navn)")
        .eq("prosjekt_id", prosjektId);

      setOppgaver(oppg || []);
      setBrukere(delt || []);
    };

    hent();
  }, [prosjektId]);

  const oppdater = async (id: string, felt: string, verdi: string) => {
    await supabase
      .from("prosjektoppgaver")
      .update({ [felt]: verdi })
      .eq("id", id);

    setOppgaver((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, [felt]: verdi } : o
      )
    );
  };

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-lg font-bold">Oppgaver</h3>

      {oppgaver.length === 0 ? (
        <p>Ingen oppgaver ennå.</p>
      ) : (
        <ul className="space-y-4">
          {oppgaver.map((o) => (
            <li key={o.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <p><strong>{o.tittel}</strong></p>
              <p className="text-sm text-gray-700">{o.beskrivelse}</p>
              <p className="text-sm">Frist: {new Date(o.frist).toLocaleDateString()}</p>

              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <select
                  value={o.status}
                  onChange={(e) => oppdater(o.id, "status", e.target.value)}
                  className="border p-2 rounded"
                >
                  <option>ikke startet</option>
                  <option>pågår</option>
                  <option>fullført</option>
                </select>

                <select
                  value={o.ansvarlig_id || ""}
                  onChange={(e) => oppdater(o.id, "ansvarlig_id", e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="">Ingen ansvarlig</option>
                  {brukere.map((b) => (
                    <option key={b.bruker_id} value={b.bruker_id}>
                      {b.bruker?.navn || b.bruker_id}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
