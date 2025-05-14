import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../lib/supabaseClient";

export default function MineDokumenter() {
  const user = useUser();
  const [dokumenter, setDokumenter] = useState<any[]>([]);

  useEffect(() => {
    const hentDokumenter = async () => {
      if (!user) return;
      const { data, error } = await supabase.storage.from("dokumenter").list(user.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) console.error("Feil ved henting av dokumenter:", error);
      else setDokumenter(data);
    };
    hentDokumenter();
  }, [user]);

  return (
    <main className="min-h-screen bg-yellow-300 text-black p-6">
      <h1 className="text-3xl font-bold mb-4">Mine dokumenter</h1>
      {dokumenter.length === 0 && <p>Ingen dokumenter funnet.</p>}
      <ul className="space-y-2">
        {dokumenter.map((doc) => (
          <li key={doc.name} className="bg-white rounded shadow p-3">
            <a
              href={`https://{ditt-prosjekt}.supabase.co/storage/v1/object/public/dokumenter/${user?.id}/${doc.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
