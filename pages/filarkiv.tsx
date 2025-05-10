import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Filarkiv() {
  const [filer, setFiler] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const promises = [
        supabase.from("fakturaer").select("fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("kontrakter").select("fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("cv").select("fil, opprettet_dato").eq("opprettet_av", id),
      ];

      const [faktura, kontrakter, cv] = await Promise.all(promises);

      const samlet = [
        ...(faktura.data || []).map((f) => ({ ...f, type: "Faktura" })),
        ...(kontrakter.data || []).map((f) => ({ ...f, type: "Kontrakt" })),
        ...(cv.data || []).map((f) => ({ ...f, type: "CV" })),
      ].filter((f) => f.fil);

      setFiler(samlet);
    };

    hent();
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Filarkiv | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Ditt filarkiv</h1>

      {filer.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen opplastede filer funnet.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-6">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Filtype</th>
              <th className="p-2">Fil</th>
              <th className="p-2">Dato</th>
              <th className="p-2">Handling</th>
            </tr>
          </thead>
          <tbody>
            {filer.map((f, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{f.type}</td>
                <td className="p-2 text-xs break-all">{f.fil}</td>
                <td className="p-2">{f.opprettet_dato?.split("T")[0] || "–"}</td>
                <td className="p-2">
                  <a
                    href={f.fil}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    Last ned
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
