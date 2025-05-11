import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import supabase from "@/lib/supabaseClient";

export default function ProsjektDetalj() {
  const router = useRouter();
  const { id } = router.query;
  const [prosjekt, setProsjekt] = useState<any>(null);
  const [deltakere, setDeltakere] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const hent = async () => {
      const { data } = await supabase
        .from("prosjekter")
        .select("*")
        .eq("id", id)
        .single();

      const { data: brukere } = await supabase
        .from("prosjektdeltakere")
        .select("*, bruker:brukerprofiler(navn)")
        .eq("prosjekt_id", id);

      setProsjekt(data);
      setDeltakere(brukere || []);
    };

    hent();
  }, [id]);

  if (!prosjekt) return <Dashboard><p>Laster prosjekt...</p></Dashboard>;

  return (
    <Dashboard>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{prosjekt.navn}</h1>
        <p className="text-sm text-gray-700">{prosjekt.beskrivelse}</p>
        <p>Status: <strong>{prosjekt.status}</strong></p>
        <p>Frist: {new Date(prosjekt.frist).toLocaleDateString()}</p>

        <div>
          <h2 className="text-lg font-bold">Deltakere</h2>
          <ul className="list-disc ml-5 text-black">
            {deltakere.map((d) => (
              <li key={d.id}>
                {d.bruker?.navn || d.bruker_id} ({d.rolle})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Dashboard>
  );
}
