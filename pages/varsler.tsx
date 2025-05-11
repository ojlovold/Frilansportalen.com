import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

interface Varsel {
  id: string;
  tekst: string;
  lenke: string;
  type: string;
  opprettet: string;
}

export default function Varsler({ brukerId }: { brukerId: string }) {
  const [varsler, setVarsler] = useState<Varsel[]>([]);

  useEffect(() => {
    const hentVarsler = async () => {
      const { data } = await supabase
        .from("varsler")
        .select("*")
        .eq("bruker_id", brukerId)
        .eq("lest", false)
        .order("opprettet", { ascending: false });

      setVarsler(data || []);
    };

    hentVarsler();
  }, [brukerId]);

  const merkSomLest = async (id: string) => {
    await supabase
      .from("varsler")
      .update({ lest: true })
      .eq("id", id);

    setVarsler((prev) => prev.filter((v) => v.id !== id));
  };

  if (varsler.length === 0) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded p-4 mb-6 space-y-2">
      <h2 className="text-lg font-bold text-black">Varsler</h2>
      {varsler.map((v) => (
        <div key={v.id} className="flex justify-between items-start text-black">
          <div>
            <p className="text-sm">{v.tekst}</p>
            <Link href={v.lenke} className="underline text-blue-600 text-sm">
              Gå til {v.type}
            </Link>
          </div>
          <button
            onClick={() => merkSomLest(v.id)}
            className="text-xs text-gray-500 hover:underline"
          >
            Merk som lest
          </button>
        </div>
      ))}
    </div>
  );
}
