import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";

export default function MineDokumenter() {
  const user = useUser();
  const [filer, setFiler] = useState<any[]>([]);

  useEffect(() => {
    const hentKvitteringer = async () => {
      if (!user?.id) return;

      const sti = `kvitteringer/${user.id}`;
      const { data, error } = await supabase.storage.from("kvitteringer").list(sti);

      if (error) {
        console.error("Feil ved henting av kvitteringer:", error.message);
      } else {
        setFiler(data || []);
      }
    };

    hentKvitteringer();
  }, [user]);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Mine dokumenter</h2>
      {filer.length === 0 ? (
        <p>Ingen dokumenter funnet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {filer.map((fil, index) => (
            <li key={index}>
              <a
                href={`https://<ditt-prosjekt>.supabase.co/storage/v1/object/public/kvitteringer/${user?.id}/${fil.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {fil.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
