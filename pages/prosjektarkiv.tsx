// pages/prosjektarkiv.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProsjektArkiv() {
  const rawUser = useUser();
  const user = rawUser && typeof rawUser === "object" && "id" in rawUser ? (rawUser as User) : null;

  const [prosjekter, setProsjekter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("prosjekter")
        .select("*")
        .eq("eier_id", user.id)
        .eq("arkivert", true)
        .order("frist", { ascending: false });

      setProsjekter(data || []);
    };

    hent();
  }, [user]);

  const gjenopprett = async (id: string) => {
    await supabase
      .from("prosjekter")
      .update({ arkivert: false })
      .eq("id", id);

    setProsjekter((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Dashboard>
      <Head>
        <title>Arkiverte prosjekter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Arkiverte prosjekter</h1>

        {prosjekter.length === 0 ? (
          <p>Du har ingen arkiverte prosjekter.</p>
        ) : (
          <ul className="space-y-4">
            {prosjekter.map((p) => (
              <li key={p.id} className="border p-4 rounded bg-white text-black shadow-sm">
                <p className="text-lg font-bold">{p.navn}</p>
                <p className="text-sm text-gray-700">{p.beskrivelse}</p>
                <p>Frist: {new Date(p.frist).toLocaleDateString("no-NO")}</p>

                <div className="flex gap-4 mt-2">
                  <Link href={`/prosjekt/${p.id}`} className="underline text-blue-600 text-sm">
                    Åpne prosjekt
                  </Link>
                  <button
                    onClick={() => gjenopprett(p.id)}
                    className="text-sm text-green-600 underline"
                  >
                    Gjenopprett
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dashboard>
  );
}
