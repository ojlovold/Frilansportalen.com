import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

interface Søknad {
  id: string;
  melding: string;
  status: string;
  cv_url: string;
  vedlegg_url: string;
  sendt: string;
  stilling: {
    id: string;
    tittel: string;
    frist: string;
  };
}

export default function MineSøknader({ brukerId }: { brukerId: string }) {
  const [søknader, setSøknader] = useState<Søknad[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("søknader")
        .select("*, stilling:stillinger(id, tittel, frist)")
        .eq("bruker_id", brukerId)
        .order("sendt", { ascending: false });

      setSøknader(data || []);
    };

    hent();
  }, [brukerId]);

  const trekk = async (id: string) => {
    await supabase.from("søknader").delete().eq("id", id);
    setSøknader((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-bold">Mine søknader</h2>

      {søknader.length === 0 ? (
        <p>Du har ikke sendt noen søknader ennå.</p>
      ) : (
        <ul className="space-y-4">
          {søknader.map((s) => (
            <li key={s.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <p><strong>Stilling:</strong> {s.stilling?.tittel || "Ukjent"}</p>
              <p><strong>Status:</strong> {s.status}</p>
              <p><strong>Sendt:</strong> {new Date(s.sendt).toLocaleDateString()}</p>
              <p><strong>Melding:</strong> {s.melding || "-"}</p>

              {s.cv_url && (
                <p><strong>CV:</strong> <a href={s.cv_url} target="_blank" className="text-blue-600 underline">Last ned</a></p>
              )}
              {s.vedlegg_url && (
                <p><strong>Vedlegg:</strong> <a href={s.vedlegg_url} target="_blank" className="text-blue-600 underline">Last ned</a></p>
              )}

              <div className="flex gap-4 mt-2">
                <Link href={`/stilling/${s.stilling?.id}`} className="text-blue-600 underline text-sm">
                  Vis stilling
                </Link>
                <button onClick={() => trekk(s.id)} className="text-red-600 underline text-sm">
                  Trekk søknad
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
