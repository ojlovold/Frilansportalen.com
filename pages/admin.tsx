import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Admin() {
  const [moduler, setModuler] = useState<any[]>([]);
  const [melding, setMelding] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from("moduler")
        .select("*")
        .order("navn");

      if (!error && data) setModuler(data);
    };

    hent();
  }, []);

  const toggle = async (id: string, aktiv: boolean) => {
    const { error } = await supabase
      .from("moduler")
      .update({ aktiv: !aktiv, sist_endret: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setModuler((m) =>
        m.map((modul) =>
          modul.id === id ? { ...modul, aktiv: !aktiv } : modul
        )
      );
      setMelding("Endring lagret");
    } else {
      setMelding("Feil under lagring");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>

      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Modulkontroll</h1>

        {melding && <p className="text-sm text-green-600 mb-4">{melding}</p>}

        <ul className="space-y-4 text-sm">
          {moduler.map((m) => (
            <li key={m.id} className="bg-white border rounded p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{m.navn}</p>
                <p className="text-gray-600 text-xs">{m.beskrivelse}</p>
              </div>
              <button
                onClick={() => toggle(m.id, m.aktiv)}
                className={`px-4 py-1 rounded text-sm ${
                  m.aktiv ? "bg-green-600 text-white" : "bg-gray-300"
                }`}
              >
                {m.aktiv ? "Aktiv" : "Inaktiv"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
