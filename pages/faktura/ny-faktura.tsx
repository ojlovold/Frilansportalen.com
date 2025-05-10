import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function NyFaktura() {
  const [til, setTil] = useState("");
  const [belop, setBelop] = useState("");
  const [status, setStatus] = useState("Ubetalt");
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

    const { error } = await supabase.from("fakturaer").insert({
      til,
      belop: parseFloat(belop),
      status,
      opprettet_av: brukerId,
    });

    if (!error) {
      setSendt(true);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Ny faktura | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Opprett ny faktura</h1>

      {sendt ? (
        <div className="bg-green-100 border border-green-400 text-green-800 rounded p-4 text-sm">
          Fakturaen er sendt inn og lagret.
        </div>
      ) : (
        <form onSubmit={sendInn} className="grid gap-4 max-w-lg">
          <input type="text" required placeholder="Mottaker" value={til} onChange={(e) => setTil(e.target.value)} className="p-2 border rounded" />
          <input type="number" required placeholder="Beløp (kr)" value={belop} onChange={(e) => setBelop(e.target.value)} className="p-2 border rounded" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded">
            <option value="Ubetalt">Ubetalt</option>
            <option value="Sendt">Sendt</option>
            <option value="Betalt">Betalt</option>
          </select>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm">
            Lagre faktura
          </button>
        </form>
      )}
    </Layout>
  );
}
