import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Admin() {
  const [moduler, setModuler] = useState<any[]>([]);
  const [melding, setMelding] = useState("");
  const [erInnlogget, setErInnlogget] = useState(false);
  const [epost, setEpost] = useState("");
  const [kode, setKode] = useState("");

  useEffect(() => {
    if (erInnlogget) {
      const hent = async () => {
        const { data, error } = await supabase
          .from("moduler")
          .select("*")
          .order("navn");

        if (!error && data) setModuler(data);
      };
      hent();
    }
  }, [erInnlogget]);

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

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (epost === "ole@frilansportalen.com" && kode === "@Bente01") {
      setErInnlogget(true);
    } else {
      setMelding("Feil e-post eller kode");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>

      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Adminpanel</h1>

        {!erInnlogget && (
          <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
            <input
              type="email"
              placeholder="E-post"
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              className="w-full border border-black rounded p-2"
              required
            />
            <input
              type="password"
              placeholder="Kode"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              className="w-full border border-black rounded p-2"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
            >
              Logg inn
            </button>
            {melding && <p className="text-sm text-red-600">{melding}</p>}
          </form>
        )}

        {erInnlogget && (
          <>
            {melding && <p className="text-sm text-green-600 mb-4">{melding}</p>}
            <ul className="space-y-4 text-sm">
              {moduler.map((m) => (
                <li
                  key={m.id}
                  className="bg-white border rounded p-4 shadow-sm flex justify-between items-center"
                >
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
          </>
        )}
      </div>
    </Layout>
  );
}
