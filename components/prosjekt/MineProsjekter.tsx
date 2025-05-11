import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import ProsjektInvite from "./ProsjektInvite";

interface Prosjekt {
  id: string;
  navn: string;
  beskrivelse: string;
  status: string;
  frist: string;
  opprettet: string;
  eier_id: string;
  deltakere: { bruker_id: string }[];
}

export default function MineProsjekter({ brukerId }: { brukerId: string }) {
  const [prosjekter, setProsjekter] = useState<Prosjekt[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: egne } = await supabase
        .from("prosjekter")
        .select("*, deltakere:prosjektdeltakere(bruker_id)")
        .eq("eier_id", brukerId);

      const { data: medlem } = await supabase
        .from("prosjektdeltakere")
        .select("prosjekt_id")
        .eq("bruker_id", brukerId);

      const medlemIds = medlem?.map((m) => m.prosjekt_id) || [];

      const { data: ekstra } = await supabase
        .from("prosjekter")
        .select("*, deltakere:prosjektdeltakere(bruker_id)")
        .in("id", medlemIds);

      const samlet = [...(egne || []), ...(ekstra || [])];
      const unike = samlet.filter(
        (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
      );

      setProsjekter(unike);
    };

    hent();
  }, [brukerId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Mine prosjekter</h2>

      {prosjekter.length === 0 ? (
        <p>Du har ingen prosjekter enda.</p>
      ) : (
        <ul className="space-y-4">
          {prosjekter.map((p) => (
            <li key={p.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <p className="text-lg font-bold">{p.navn}</p>
              <p className="text-sm text-gray-700">{p.beskrivelse}</p>
              <p className="text-sm">Status: <strong>{p.status}</strong></p>
              <p className="text-sm">Frist: {new Date(p.frist).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">
                Deltakere: {p.deltakere?.map((d) => d.bruker_id).join(", ") || "-"}
              </p>

              <Link
                href={`/prosjekt/${p.id}`}
                className="inline-block mt-2 text-blue-600 underline text-sm"
              >
                Åpne prosjekt
              </Link>

              {/* Invitasjonsfunksjon */}
              <ProsjektInvite prosjektId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
