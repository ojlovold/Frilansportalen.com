import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";
import ProsjektInvite from "./ProsjektInvite";
import ProsjektFavoritt from "./ProsjektFavoritt";

interface Prosjekt {
  id: string;
  navn: string;
  beskrivelse: string;
  status: string;
  frist: string;
  etiketter?: string[];
  gruppe_id?: string;
  eier_id: string;
  deltakere: { bruker_id: string; favoritt?: boolean }[];
}

export default function MineProsjekter({ brukerId }: { brukerId: string }) {
  const [alle, setAlle] = useState<Prosjekt[]>([]);
  const [filtrert, setFiltrert] = useState<Prosjekt[]>([]);
  const [statusFilter, setStatusFilter] = useState("alle");
  const [sortering, setSortering] = useState("frist");
  const [alleEtiketter, setAlleEtiketter] = useState<string[]>([]);
  const [etikettFilter, setEtikettFilter] = useState("alle");
  const [alleGrupper, setAlleGrupper] = useState<any[]>([]);
  const [gruppeFilter, setGruppeFilter] = useState("alle");

  useEffect(() => {
    const hent = async () => {
      const { data: egne } = await supabase
        .from("prosjekter")
        .select("*, deltakere:prosjektdeltakere(bruker_id, favoritt)")
        .eq("eier_id", brukerId);

      const { data: medlem } = await supabase
        .from("prosjektdeltakere")
        .select("prosjekt_id, favoritt")
        .eq("bruker_id", brukerId);

      const medlemIds = medlem?.map((m) => m.prosjekt_id) || [];

      const { data: ekstra } = await supabase
        .from("prosjekter")
        .select("*, deltakere:prosjektdeltakere(bruker_id, favoritt)")
        .in("id", medlemIds.length > 0 ? medlemIds : [""]);

      const samlet = [...(egne || []), ...(ekstra || [])];
      const unike = samlet.filter(
        (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
      );

      const etiketter = new Set<string>();
      unike.forEach((p) =>
        (p.etiketter || []).forEach((e: string) => etiketter.add(e))
      );
      setAlleEtiketter(Array.from(etiketter));

      const { data: grupper } = await supabase
        .from("prosjektgrupper")
        .select("*")
        .eq("eier_id", brukerId);
      setAlleGrupper(grupper || []);

      setAlle(unike);
    };

    hent();
  }, [brukerId]);

  useEffect(() => {
    let p = [...alle];

    if (statusFilter !== "alle") {
      p = p.filter((x) => x.status === statusFilter);
    }

    if (etikettFilter !== "alle") {
      p = p.filter((x) => x.etiketter?.includes(etikettFilter));
    }

    if (gruppeFilter !== "alle") {
      p = p.filter((x) => x.gruppe_id === gruppeFilter);
    }

    if (sortering === "frist") {
      p.sort((a, b) => new Date(a.frist).getTime() - new Date(b.frist).getTime());
    } else if (sortering === "navn") {
      p.sort((a, b) => a.navn.localeCompare(b.navn));
    } else if (sortering === "favoritt") {
      p.sort((a, b) => {
        const favA = a.deltakere?.find((d) => d.bruker_id === brukerId)?.favoritt ? -1 : 0;
        const favB = b.deltakere?.find((d) => d.bruker_id === brukerId)?.favoritt ? -1 : 0;
        return favA - favB;
      });
    }

    setFiltrert(p);
  }, [alle, statusFilter, sortering, etikettFilter, gruppeFilter, brukerId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Mine prosjekter</h2>

      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="alle">Alle statuser</option>
          <option value="aktiv">Aktive</option>
          <option value="fullført">Fullførte</option>
          <option value="avbrutt">Avbrutte</option>
        </select>

        <select
          value={sortering}
          onChange={(e) => setSortering(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="frist">Sorter etter frist</option>
          <option value="navn">Sorter etter navn</option>
          <option value="favoritt">Sorter etter favoritt</option>
        </select>

        <select
          value={etikettFilter}
          onChange={(e) => setEtikettFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="alle">Alle etiketter</option>
          {alleEtiketter.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <select
          value={gruppeFilter}
          onChange={(e) => setGruppeFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="alle">Alle grupper</option>
          {alleGrupper.map((g) => (
            <option key={g.id} value={g.id}>{g.navn}</option>
          ))}
        </select>
      </div>

      {filtrert.length === 0 ? (
        <p>Ingen prosjekter matcher filtrene.</p>
      ) : (
        <ul className="space-y-4">
          {filtrert.map((p) => (
            <li key={p.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <div className="flex justify-between">
                <p className="text-lg font-bold">{p.navn}</p>
                <ProsjektFavoritt prosjektId={p.id} />
              </div>

              <p className="text-sm text-gray-700">{p.beskrivelse}</p>
              <p className="text-sm">Status: <strong>{p.status}</strong></p>
              <p className="text-sm">Frist: {new Date(p.frist).toLocaleDateString()}</p>
              {p.etiketter?.length > 0 && (
                <p className="text-sm text-gray-500">Etiketter: {p.etiketter.join(", ")}</p>
              )}
              <p className="text-sm text-gray-500">
                Deltakere: {p.deltakere?.map((d) => d.bruker_id).join(", ") || "-"}
              </p>

              <Link
                href={`/prosjekt/${p.id}`}
                className="inline-block mt-2 text-blue-600 underline text-sm"
              >
                Åpne prosjekt
              </Link>

              <ProsjektInvite prosjektId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
