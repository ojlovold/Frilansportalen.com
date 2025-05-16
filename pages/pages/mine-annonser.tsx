import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AnnonseKort from "@/components/AnnonseKort";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MineAnnonser() {
  const [annonser, setAnnonser] = useState<any[]>([]);
  const [brukerId, setBrukerId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData?.user?.id ?? null;
      setBrukerId(id);

      if (id) {
        const { data } = await supabase
          .from("annonser")
          .select("*")
          .eq("bruker_id", id)
          .order("created_at", { ascending: false });

        if (data) setAnnonser(data);
      }
    };

    hent();
  }, []);

  const slettAnnonse = async (id: string) => {
    const bekreft = confirm("Slette denne annonsen?");
    if (!bekreft) return;

    await supabase.from("annonser").delete().eq("id", id);
    setAnnonser((a) => a.filter((x) => x.id !== id));
  };

  const redigerAnnonse = (id: string) => {
    router.push(`/rediger-annonse?id=${id}`);
  };

  return (
    <>
      <Head>
        <title>Mine annonser | Frilansportalen</title>
      </Head>

      <main className="min-h-screen bg-portalGul text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mine annonser</h1>
          <Link href="/" className="text-sm text-blue-600 underline">
            Tilbake til forsiden
          </Link>
        </div>

        {annonser.length === 0 ? (
          <p>Du har ikke lagt ut noen annonser enda.</p>
        ) : (
          annonser.map((annonse) => (
            <div key={annonse.id} className="mb-8">
              <AnnonseKort annonse={annonse} />
              <div className="flex gap-4">
                <button
                  onClick={() => redigerAnnonse(annonse.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Rediger
                </button>
                <button
                  onClick={() => slettAnnonse(annonse.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Slett
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}
