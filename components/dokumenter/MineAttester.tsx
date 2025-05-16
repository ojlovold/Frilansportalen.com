import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

type Dokument = {
  name: string;
  url: string;
};

export default function MineAttester() {
  const user = useUser();
  const [dokumenter, setDokumenter] = useState<Dokument[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      if (!user) return;

      const { data, error } = await supabase.storage
        .from("attester")
        .list(`${user.id}/`, { limit: 100 });

      if (error) {
        setStatus("Feil ved henting: " + error.message);
        return;
      }

      const filer = await Promise.all(
        (data || []).map(async (fil) => {
          const { data: urlData } = await supabase.storage
            .from("attester")
            .createSignedUrl(`${user.id}/${fil.name}`, 60 * 10); // 10 min
          return {
            name: fil.name,
            url: urlData?.signedUrl || "#",
          };
        })
      );

      setDokumenter(filer);
    };

    hent();
  }, [user]);

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Mine attester</h2>

      {status && <p className="mb-4 text-sm text-red-600">{status}</p>}

      {dokumenter.length === 0 ? (
        <p>Ingen attester funnet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {dokumenter.map((d) => (
            <li key={d.name}>
              <a href={d.url} target="_blank" className="text-blue-600 underline">
                {d.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
