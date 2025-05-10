import Head from "next/head";
import Layout from "../../components/Layout";
import FileUpload from "../../components/FileUpload";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function NyKontrakt() {
  const [navn, setNavn] = useState("");
  const [motpart, setMotpart] = useState("");
  const [status, setStatus] = useState("Venter på signatur");
  const [filUrl, setFilUrl] = useState("");
  const [sendt, setSendt] = useState(false);
  const router = useRouter();

  const sendInn = async (e: React.FormEvent) => {
    e.preventDefault();
    const bruker = await supabase.auth.getUser();
    const brukerId = bruker.data.user?.id;

    if (!brukerId) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("kontrakter").insert({
      navn,
      motpart,
      status,
      fil: filUrl,
      opprettet_av: brukerId,
    });

    if (!error) {
      setSendt(true);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Ny kontrakt | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Last opp ny kontrakt</h1>

      {sendt ? (
        <div className="bg-green-100 border border-green-400 text-green-800 rounded p-4 text-sm">
          Kontrakten er lastet opp og lagret.
        </div>
      ) : (
        <form onSubmit={sendInn} className="grid gap-4 max-w-lg">
          <input
            required
            type="text"
            placeholder="Navn på kontrakt"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            required
            type="text"
            placeholder="Motpart"
            value={motpart}
            onChange={(e) => setMotpart(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Venter på signatur">Venter på signatur</option>
            <option value="Signert">Signert</option>
            <option value="Forkastet">Forkastet</option>
          </select>

          {/* Her lastes filen opp til 'kontrakter' bucket */}
          <FileUpload onUpload={(url) => setFilUrl(url)} folder="kontrakter" />

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Lagre kontrakt
          </button>
        </form>
      )}
    </Layout>
  );
}
