import Head from "next/head";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import { hentFavoritter } from "@/lib/hentFavoritter";

export default function FavoritterSide() {
  const user = useUser() as unknown as User;
  const [stillinger, setStillinger] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      if (!user?.id) return;

      const favorittPoster = await hentFavoritter(user.id, "stilling");
      const idListe = favorittPoster.map((f: any) => f.objekt_id);

      if (idListe.length > 0) {
        const { data } = await supabase
          .from("stillinger")
          .select("*")
          .in("id", idListe);

        if (data) setStillinger(data);
      }
    };

    hent();
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>Mine favoritter | Frilansportalen</title>
      </Head>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mine favoritter</h1>

        {stillinger.length === 0 ? (
          <p>Du har ikke lagret noen favoritter.</p>
        ) : (
          <ul className="space-y-4">
            {stillinger.map((s) => (
              <li key={s.id} className="bg-white p-4 border rounded shadow-sm">
                <h2 className="font-semibold text-lg">{s.tittel}</h2>
                <p className="text-sm text-gray-600">{s.sted}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
