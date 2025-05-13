import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import supabase from "@/lib/supabaseClient"; // ← riktig default-import

export default function SjappaStatistikk() {
  const rawUser = useUser();
  const user = rawUser as unknown as User | null;

  const [antall, setAntall] = useState(0);
  const [fordeling, setFordeling] = useState<{ [type: string]: number }>({});
  const [laster, setLaster] = useState(true);
  const [feil, setFeil] = useState<string | null>(null);

  useEffect(() => {
    const hent = async () => {
      if (!user) {
        setLaster(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("annonser")
          .select("type")
          .eq("opprettet_av", user.id); // ← husk riktig kolonnenavn

        if (error) throw error;
        if (!data) return;

        setAntall(data.length);

        const teller: { [type: string]: number } = {};
        data.forEach((a) => {
          const type = a.type || "Ukjent";
          teller[type] = (teller[type] || 0) + 1;
        });

        setFordeling(teller);
      } catch (err) {
        console.error("Feil ved henting av data:", err);
        setFeil("Kunne ikke hente statistikk.");
      } finally {
        setLaster(false);
      }
    };

    hent();
  }, [user]);

  if (!user) {
    return (
      <Dashboard>
        <h1 className="text-2xl font-bold">Statistikk</h1>
        <p>Du må være innlogget for å se denne siden.</p>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold mb-4">Statistikk</h1>

      {laster ? (
        <p>Laster data...</p>
      ) : feil ? (
        <p className="text-red-600">{feil}</p>
      ) : (
        <>
          <p className="text-sm text-black">
            Antall publiserte annonser: <strong>{antall}</strong>
          </p>

          <ul className="text-sm text-black mt-4 space-y-1">
            {Object.entries(fordeling).map(([type, count]) => (
              <li key={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}:{" "}
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </Dashboard>
  );
}
