// pages/kontrakter.tsx
import Head from "next/head";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Dashboard from "@/components/Dashboard";
import LastOppKontrakt from "@/components/kontrakt/LastOppKontrakt";
import EksporterKontraktPDF from "@/components/kontrakt/EksporterKontraktPDF";

interface Kontrakt {
  id: string;
  navn: string;
  fil_url: string;
  opprettet: string;
  oppretter: string;
  mottaker?: string;
  slettet?: boolean;
}

export default function Kontrakter() {
  const user = useUser() as unknown as User;
  const [liste, setListe] = useState<Kontrakt[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("kontrakter")
        .select("*")
        .or(`oppretter.eq.${user.id},mottaker.eq.${user.id}`)
        .not("slettet", "is", true)
        .order("opprettet", { ascending: false });

      if (!error && data) setListe(data);
    };

    hent();
  }, [user]);

  return (
    <Dashboard>
      <Head>
        <title>Kontrakter | Frilansportalen</title>
      </Head>

      <div className="space-y-6">
        <LastOppKontrakt brukerId={user.id} />
        <EksporterKontraktPDF brukerId={user.id} />

        <h2 className="text-xl font-bold mt-10">Dine kontrakter</h2>
        <ul className="space-y-3">
          {liste.map((k) => (
            <li key={k.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{k.navn}</p>
              <p className="text-sm text-gray-600">
                Opprettet: {new Date(k.opprettet).toLocaleDateString("no-NO")}
              </p>
              <a
                href={k.fil_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Last ned
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Dashboard>
  );
}
