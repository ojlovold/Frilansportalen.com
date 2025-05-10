import Head from "next/head";
import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function Svar() {
  const [til, setTil] = useState("");
  const [melding, setMelding] = useState("");
  const [sendt, setSendt] = useState(false);
  const router = useRouter();

  const sendSvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const bruker = await supabase.auth.getUser();
    const fraId = bruker.data.user?.id;

    if (!fraId) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("meldinger").insert({
      fra: fraId,
      til,
      melding,
    });

    if (!error) {
      setSendt(true);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Svar på melding | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Svar på melding</h1>

      {sendt ? (
        <div className="bg-green-100 border border-green-400 text-green-800 rounded p-4 text-sm">
          Meldingen er sendt.
        </div>
      ) : (
        <form onSubmit={sendSvar} className="grid gap-4 max-w-lg">
          <input
            required
            type="text"
            placeholder="Mottakerens bruker-ID (UUID)"
            value={til}
            onChange={(e) => setTil(e.target.value)}
            className="p-2 border rounded"
          />
          <textarea
            required
            placeholder="Skriv meldingen din..."
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
            className="p-2 border rounded h-32 resize-none"
          ></textarea>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Send svar
          </button>
        </form>
      )}
    </Layout>
  );
}
