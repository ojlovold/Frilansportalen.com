import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import supabase from "@/lib/supabaseClient";

type SokelogEntry = {
  id: number;
  søkeord: string;
  tidspunkt: string;
};

export default function Sokehistorikk() {
  const rawUser = useUser();
  const user = rawUser as unknown as User | null;

  const [historikk, setHistorikk] = useState<SokelogEntry[]>([]);
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
          .from("sokelogg")
          .select("*")
          .eq("bruker_id", user.id)
          .order("tidspunkt", { ascending: false });

        if (error) throw error;
        if (data) setHistorikk(data);
      } catch (err) {
        console.error("Feil ved henting av søkelogg:", err);
        setFeil("Kunne ikke hente søkehistorikk.");
      } finally {
        setLaster(false);
      }
    };

    hent();
  }, [user]);

  if (!user) {
    return (
      <Dashboard>
        <h1 className="text-2xl font-bold mb-4">Søkehistorikk</h1>
        <p>Du må være innlogget for å se denne siden.</p>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold mb-4">Søkehistorikk</h1>

      {laster ? (
        <p>Laster data...</p>
      ) : feil ? (
        <p className="text-red-600">{feil}</p>
      ) : historikk.length === 0 ? (
        <p className="text-sm text-black">Ingen søk registrert ennå.</p>
      ) : (
        <ul className="text-sm text-black space-y-2">
          {historikk.map((rad) => (
            <li key={rad.id}>
              <strong>{rad.søkeord}</strong>{" "}
              <span className="text-gray-600">({new Date(rad.tidspunkt).toLocaleString()})</span>
            </li>
          ))}
        </ul>
      )}
    </Dashboard>
  );
}
