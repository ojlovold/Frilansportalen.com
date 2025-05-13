import Head from "next/head";
import Dashboard from "@/components/Dashboard";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function SjappaStatistikk() {
  const user = useUser() as User | null;
  const [antall, setAntall] = useState(0);
  const [fordeling, setFordeling] = useState<{ [type: string]: number }>({});

  useEffect(() => {
    const hent = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("annonser")
        .select("type")
        .eq("opprettet_av", user.id);

      if (!data) return;

      setAntall(data.length);

      const teller: { [type: string]: number } = {};
      data.forEach((a) => {
        teller[a.type] = (teller[a.type] || 0) + 1;
      });

      setFordeling(teller);
    };

    hent();
  }, [user]);

  if (!user) return <p>Du må være innlogget.</p>;

  return (
    <Dashboard>
      <Head>
        <title>Sjappa – statistikk | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Din aktivitet i Sjappa</h1>

        <p className="text-black text-sm">
          Antall publiserte annonser: <strong>{antall}</strong>
        </p>

        <ul className="text-black text-sm space-y-1">
          {Object.entries(fordeling).map(([type, count]) => (
            <li key={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}: <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </div>
    </Dashboard>
  );
}
