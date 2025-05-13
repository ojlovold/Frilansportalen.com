import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import supabase from "../lib/supabaseClient";

type Rapport = {
  name: string;
};

export default function MineRapporter() {
  const user = useUser() as unknown as User;
  const [rapporter, setRapporter] = useState<Rapport[]>([]);

  useEffect(() => {
    const hentRapporter = async () => {
      const brukerId = user?.id;
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

  const prosjektUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Sett denne i .env

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Mine rapporter</h2>
      {rapporter.length === 0 ? (
        <p>Ingen rapporter funnet.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {rapporter.map((rapport) => (
            <li key={rapport.name}>
              <a
                href={`${prosjektUrl}/storage/v1/object/public/rapporter/${user.id}/${rapport.name}`}
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
