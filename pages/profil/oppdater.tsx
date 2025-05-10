import Head from "next/head";
import Layout from "../../components/Layout";
import FileUploadProfil from "../../components/FileUploadProfil";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function OppdaterProfil() {
  const [navn, setNavn] = useState("");
  const [bilde, setBilde] = useState("");
  const [epost, setEpost] = useState("");
  const [rolle, setRolle] = useState("");
  const [lagret, setLagret] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) return;

      const { data } = await supabase.from("profiler").select("*").eq("id", id).single();
      if (data) {
        setNavn(data.navn || "");
        setBilde(data.bilde || "");
        setEpost(data.epost || "");
        setRolle(data.rolle || "");
      }
    };

    hent();
  }, []);

  const lagre = async () => {
    const bruker = await supabase.auth.getUser();
    const id = bruker.data.user?.id;
    if (!id) {
      router.push("/login");
      return;
    }

    await supabase.from("profiler").upsert({
      id,
      navn,
      bilde,
      epost,
      rolle,
    });

    setLagret(true);
  };

  return (
    <Layout>
      <Head>
        <title>Oppdater profil | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Oppdater profil</h1>

      <div className="max-w-lg grid gap-4">
        <input
          type="text"
          placeholder="Visningsnavn"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="email"
          placeholder="Personlig e-post"
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Velg rolle</option>
          <option value="frilanser">Frilanser</option>
          <option value="jobbsøker">Jobbsøker</option>
        </select>

        <FileUploadProfil onUpload={(url) => setBilde(url)} />

        <button
          onClick={lagre}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Lagre profil
        </button>

        {lagret && <p className="text-sm text-green-700">Profil oppdatert.</p>}
      </div>
    </Layout>
  );
}
