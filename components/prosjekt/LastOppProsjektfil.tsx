// Fil: /components/prosjekt/LastOppProsjektfil.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface Prosjektfil {
  id: string;
  filnavn: string;
  url: string;
  opplastet: string;
  opplaster_id: string;
}

export default function LastOppProsjektfil({ prosjektId }: { prosjektId: string }) {
  const user = useUser();
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [filer, setFiler] = useState<Prosjektfil[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("prosjektfiler")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("opplastet", { ascending: false });

      setFiler(data || []);
    };

    hent();
  }, [prosjektId]);

  const lastOpp = async () => {
    const brukerId = user && "id" in user ? (user.id as string) : null;
    if (!fil || !brukerId) return;

    const path = `prosjekter/${prosjektId}/${Date.now()}_${fil.name}`;
    const { error: uploadError } = await supabase.storage
      .from("prosjektfiler")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Feil ved opplasting");
      return;
    }

    const url = supabase.storage.from("prosjektfiler").getPublicUrl(path).data.publicUrl;

    const { error } = await supabase.from("prosjektfiler").insert([
      {
        prosjekt_id: prosjektId,
        opplaster_id: brukerId,
        filnavn: fil.name,
        url,
      },
    ]);

    setStatus(error ? "Kunne ikke lagre fil" : "Fil lastet opp!");
    if (!error) {
      setFil(null);
      const { data: oppdatert } = await supabase
        .from("prosjektfiler")
        .select("*")
        .eq("prosjekt_id", prosjektId)
        .order("opplastet", { ascending: false });

      setFiler(oppdatert || []);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Last opp prosjektfil</h2>

      <input type="file" onChange={(e) => setFil(e.target.files?.[0] || null)} />

      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp
      </button>

      {status && <p className="text-sm text-green-600">{status}</p>}

      <ul className="space-y-2">
        {filer.map((f) => (
          <li key={f.id} className="flex justify-between items-center border p-2 rounded">
            <a href={f.url} target="_blank" className="text-blue-600 underline">
              {f.filnavn}
            </a>
            <span className="text-xs text-gray-500">{new Date(f.opplastet).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
