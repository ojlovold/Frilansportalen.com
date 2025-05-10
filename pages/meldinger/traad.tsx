import Head from "next/head";
import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function Traad() {
  const [innhold, setInnhold] = useState("");
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const [tilId, setTilId] = useState("");
  const [brukerId, setBrukerId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }
      setBrukerId(id);
      if (tilId.length < 10) return;

      const { data } = await supabase
        .from("meldinger")
        .select("*")
        .or(`(fra.eq.${id},til.eq.${tilId}),(fra.eq.${tilId},til.eq.${id})`)
        .order("tidspunkt", { ascending: true });

      setMeldinger(data || []);
    };

    hent();
  }, [tilId, router]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("meldinger").insert({
      fra: brukerId,
      til: tilId,
      melding: innhold,
    });

    if (!error) {
      setInnhold("");
      const { data } = await supabase
        .from("meldinger")
        .select("*")
        .or(`(fra.eq.${brukerId},til.eq.${tilId}),(fra.eq.${tilId},til.eq.${brukerId})`)
        .order("tidspunkt", { ascending: true });

      setMeldinger(data || []);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Meldingstråd | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Meldingstråd</h1>

      <input
        type="text"
        placeholder="Mottakerens bruker-ID (UUID)"
        value={tilId}
        onChange={(e) => setTilId(e.target.value)}
        className="p-2 border rounded w-full max-w-lg mb-4"
      />

      <div className="bg-white border border-black rounded p-4 mb-6 text-sm space-y-3">
        {meldinger.map(({ fra, melding, tidspunkt }, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-gray-500 text-xs mb-1">
              {fra === brukerId ? "Du" : "Motpart"} • {tidspunkt.split("T")[0]}
            </span>
            <span>{melding}</span>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="grid gap-3 max-w-lg">
        <textarea
          required
          placeholder="Skriv svar..."
          value={innhold}
          onChange={(e) => setInnhold(e.target.value)}
          className="p-2 border rounded h-28 resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Send svar
        </button>
      </form>
    </Layout>
  );
}
