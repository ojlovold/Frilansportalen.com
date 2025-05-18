import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Invitasjon {
  id: string;
  prosjekt_id: string;
  rolle: string;
  prosjekt: {
    navn: string;
    beskrivelse: string;
    frist: string;
    status: string;
  }[];
}

export default function MineInvitasjoner({ brukerId }: { brukerId: string }) {
  const [invitasjoner, setInvitasjoner] = useState<Invitasjon[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektdeltakere")
        .select("id, prosjekt_id, rolle, prosjekt:prosjekter(navn, beskrivelse, frist, status)")
        .eq("bruker_id", brukerId)
        .eq("bekreftet", false);

      setInvitasjoner(data || []);
    };

    hent();
  }, [brukerId]);

  const bekreft = async (id: string) => {
    await supabase.from("prosjektdeltakere").update({ bekreftet: true }).eq("id", id);
    setInvitasjoner((prev) => prev.filter((i) => i.id !== id));
  };

  const avslå = async (id: string) => {
    await supabase.from("prosjektdeltakere").delete().eq("id", id);
    setInvitasjoner((prev) => prev.filter((i) => i.id !== id));
  };

  if (invitasjoner.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Invitasjoner til prosjekter</h2>

      <ul className="space-y-4">
        {invitasjoner.map((i) => (
          <li key={i.id} className="border p-4 rounded bg-white text-black shadow-sm">
            <p className="text-lg font-bold">{i.prosjekt[0]?.navn}</p>
            <p className="text-sm text-gray-700">{i.prosjekt[0]?.beskrivelse}</p>
            <p>Status: <strong>{i.prosjekt[0]?.status}</strong></p>
            <p>Frist: {i.prosjekt[0]?.frist && new Date(i.prosjekt[0].frist).toLocaleDateString()}</p>
            <p>Rolle: {i.rolle}</p>

            <div className="flex gap-4 mt-2">
              <button onClick={() => bekreft(i.id)} className="bg-black text-white px-3 py-2 rounded text-sm">
                Bli med i prosjekt
              </button>
              <button onClick={() => avslå(i.id)} className="text-red-600 underline text-sm">
                Avslå
              </button>
              <Link href={`/prosjekt/${i.prosjekt_id}`} className="text-blue-600 underline text-sm">
                Vis prosjekt
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
