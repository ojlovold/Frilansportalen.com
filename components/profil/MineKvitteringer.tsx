import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Fil {
  name: string;
  path: string;
}

export default function MineKvitteringer({ brukerId }: { brukerId: string }) {
  const [filer, setFiler] = useState<Fil[]>([]);
  const [status, setStatus] = useState("");

  const hentKvitteringer = async () => {
    const { data, error } = await supabase.storage
      .from("dokumenter")
      .list(`kvitteringer/${brukerId}`, { limit: 100 });

    if (!error && data) {
      setFiler(data);
    }
  };

  useEffect(() => {
    hentKvitteringer();
  }, [brukerId]);

  const slett = async (filnavn: string) => {
    const fullPath = `kvitteringer/${brukerId}/${filnavn}`;
    const { error } = await supabase.storage
      .from("dokumenter")
      .remove([fullPath]);

    if (!error) {
      setStatus("Kvittering slettet");
      hentKvitteringer();
    } else {
      setStatus("Kunne ikke slette");
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Mine kvitteringer</h2>

      {status && <p className="text-sm text-green-600">{status}</p>}

      {filer.length === 0 ? (
        <p>Ingen kvitteringer funnet.</p>
      ) : (
        <ul className="space-y-2 text-black">
          {filer.map((f) => (
            <li key={f.name} className="flex justify-between items-center border p-2 rounded">
              <a
                href={supabase.storage
                  .from("dokumenter")
                  .getPublicUrl(`kvitteringer/${brukerId}/${f.name}`).data.publicUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                {f.name}
              </a>
              <button
                onClick={() => slett(f.name)}
                className="text-red-600 text-sm underline"
              >
                Slett
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
