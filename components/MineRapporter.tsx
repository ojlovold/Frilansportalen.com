import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";

export default function MineRapporter() {
  const { user } = useUser();
  const [rapporter, setRapporter] = useState<any[]>([]);

  useEffect(() => {
    const hentRapporter = async () => {
      const brukerId = user?.id ?? user?.user_metadata?.id;
      if (!brukerId) return;

      const sti = `rapporter/${brukerId}`;
      const { data, error } = await supabase.storage.from("rapporter").list(sti);

      if (error) {
        console.error("Feil ved henting av rapporter:", error.message);
      } else {
        setRapporter(data || []);
      }
    };

    hentRapporter();
  }, [user]);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Mine rapporter</h2>
      {rapporter.length === 0 ? (
        <p>Ingen rapporter funnet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {rapporter.map((rapport, index) => (
            <li key={index}>
              <a
                href={`https://<ditt-prosjekt>.supabase.co/storage/v1/object/public/rapporter/${user?.id}/${rapport.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {rapport.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
