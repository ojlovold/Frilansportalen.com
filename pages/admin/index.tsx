import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";

export default function AdminPanel() {
  const [design, setDesign] = useState({
    primar: "",
    sekundar: "",
    bakgrunn: "",
    tekst: "",
    logo_url: ""
  });
  const [integrasjoner, setIntegrasjoner] = useState<any>({});
  const [status, setStatus] = useState("");

  const typer = ["vipps", "altinn", "stripe"] as const;

  useEffect(() => {
    const hent = async () => {
      const { data: d } = await supabase.from("designvalg").select("*").single();
      if (d) setDesign(d);

      const integrasjonerData: any = {};
      for (const t of typer) {
        const { data } = await supabase.from("integrasjoner").select("*").eq("id", t).maybeSingle();
        if (data) integrasjonerData[t] = data;
      }
      setIntegrasjoner(integrasjonerData);
    };
    hent();
  }, []);

  const lagreDesign = async () => {
    const { error } = await supabase.from("designvalg").update(design).eq("id", 1);
    setStatus(error ? "Feil ved lagring av design" : "Design lagret!");
  };

  const lagreIntegrasjon = async (id: string) => {
    const { error } = await supabase.from("integrasjoner").upsert([integrasjoner[id]]);
    setStatus(error ? `Feil ved lagring av ${id}` : `${id} lagret!`);
  };

  const handleIntegrasjonChange = (id: string, field: string, value: any) => {
    setIntegrasjoner((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  return (
    <>
      <Head>
        <title>Adminpanel | Frilansportalen</title>
      </Head>
      <main className="min-h-screen bg-portalGul text-black p-8 space-y-10">
        <h1 className="text-3xl font-bold">Adminpanel</h1>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Design og logo</h2>
          {Object.keys(design).map((key) => (
            <input
              key={key}
              type="text"
              value={(design as any)[key]}
              onChange={(e) => setDesign({ ...design, [key]: e.target.value })}
              placeholder={key}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button onClick={lagreDesign} className="bg-black text-white px-4 py-2 rounded">
            Lagre design
          </button>
        </section>

        {typer.map((id) => (
          <section key={id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">{id.toUpperCase()}</h2>
            {Object.entries(integrasjoner[id] || {}).map(([felt, verdi]) => (
              <input
                key={felt}
                type="text"
                value={verdi ?? ""}
                onChange={(e) => handleIntegrasjonChange(id, felt, e.target.value)}
                placeholder={felt}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
            <button
              onClick={() => lagreIntegrasjon(id)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Lagre {id}
            </button>
          </section>
        ))}

        {status && <p className="text-green-600 text-sm">{status}</p>}
      </main>
    </>
  );
}
