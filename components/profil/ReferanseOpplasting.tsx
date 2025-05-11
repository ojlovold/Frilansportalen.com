import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface RefFil {
  id: string;
  url: string;
  filnavn: string;
  opplastet: string;
}

export default function ReferanseOpplasting({ brukerId }: { brukerId: string }) {
  const [fil, setFil] = useState<File | null>(null);
  const [filer, setFiler] = useState<RefFil[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("dokumenter")
        .select("id, url, filnavn, opplastet")
        .eq("bruker_id", brukerId)
        .eq("type", "referanse");
      setFiler(data || []);
    };

    hent();
  }, [brukerId]);

  const lastOpp = async () => {
    if (!fil) return;
    const path = `referanser/${brukerId}/${Date.now()}_${fil.name}`;

    const { error: uploadError } = await supabase.storage
      .from("dokumenter")
      .upload(path, fil);

    if (uploadError) {
      setStatus("Feil ved opplasting");
      return;
    }

    const url = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;

    const { error: metaError } = await supabase.from("dokumenter").insert([
      {
        bruker_id: brukerId,
        filnavn: fil.name,
        url,
        type: "referanse",
      },
    ]);

    if (!metaError) {
      setStatus("Referanse lastet opp!");
      setFil(null);
      const { data } = await supabase
        .from("dokumenter")
        .select("id, url, filnavn, opplastet")
        .eq("bruker_id", brukerId)
        .eq("type", "referanse");
      setFiler(data || []);
    }
  };

  const slett = async (id: string) => {
    await supabase.from("dokumenter").delete().eq("id", id);
    setFiler((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Last opp referanser</h2>

      <input type="file" onChange={(e) => setFil(e.target.files?.[0] || null)} />
      <button onClick={lastOpp} className="bg-black text-white px-4 py-2 rounded">
        Last opp
      </button>
      <p className="text-green-600 text-sm">{status}</p>

      {filer.length > 0 && (
        <ul className="space-y-2">
          {filer.map((f) => (
            <li key={f.id} className="text-sm text-black border p-2 rounded flex justify-between items-center">
              <span>
                <a href={f.url} target="_blank" className="text-blue-600 underline">{f.filnavn}</a> –{" "}
                {new Date(f.opplastet).toLocaleDateString()}
              </span>
              <button onClick={() => slett(f.id)} className="text-red-600 underline text-xs">
                Slett
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
