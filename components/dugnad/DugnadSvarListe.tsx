import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function DugnadSvarListe({ dugnadId }: { dugnadId: string }) {
  const user = useUser();
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [erEier, setErEier] = useState(false);

  useEffect(() => {
    const hent = async () => {
      if (!user) return;

      const { data: dugnad } = await supabase
        .from("dugnader")
        .select("opprettet_av")
        .eq("id", dugnadId)
        .single();

      if (dugnad?.opprettet_av !== user.id) {
        setErEier(false);
        return;
      }

      setErEier(true);

      const { data } = await supabase
        .from("dugnadsmeldinger")
        .select("*, bruker:brukerprofiler(navn, epost)")
        .eq("dugnad_id", dugnadId)
        .order("opprettet", { ascending: false });

      setMeldinger(data || []);
    };

    hent();
  }, [user, dugnadId]);

  if (!erEier) return null;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-bold">Meldinger fra frivillige</h3>

      {meldinger.length === 0 ? (
        <p>Ingen meldinger mottatt ennå.</p>
      ) : (
        <ul className="space-y-3">
          {meldinger.map((m) => (
            <li key={m.id} className="border p-3 rounded bg-white text-black">
              <p><strong>{m.bruker?.navn || m.bruker_id}</strong> ({m.bruker?.epost || "ukjent"})</p>
              <p className="text-sm">{m.melding || "(ingen melding)"}</p>
              <p className="text-xs text-gray-500">{new Date(m.opprettet).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
