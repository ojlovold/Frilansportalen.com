import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

interface Fil {
  name: string;
  path: string;
}

export default function MineKvitteringer({ brukerId }: { brukerId: string }) {
  const [filer, setFiler] = useState<Fil[]>([]);

  useEffect(() => {
    const hentKvitteringer = async () => {
      const { data, error } = await supabase.storage
        .from("dokumenter")
        .list(`kvitteringer/${brukerId}`, { limit: 100 });

      if (!error && data) {
        setFiler(data);
      }
    };

    hentKvitteringer();
  }, [brukerId]);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold">Mine kvitteringer</h2>

      {filer.length === 0 ? (
        <p>Ingen kvitteringer funnet.</p>
      ) : (
        <ul className="space-y-2 text-black">
          {filer.map((f) => (
            <li key={f.name}>
              <a
                href={supabase.storage
                  .from("dokumenter")
                  .getPublicUrl(`kvitteringer/${brukerId}/${f.name}`).data.publicUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
