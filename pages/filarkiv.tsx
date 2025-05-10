import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Filarkiv() {
  const [filer, setFiler] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hent = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const [faktura, kontrakter, cv] = await Promise.all([
        supabase.from("fakturaer").select("id, fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("kontrakter").select("id, fil, opprettet_dato").eq("opprettet_av", id),
        supabase.from("cv").select("id, fil, opprettet_dato").eq("opprettet_av", id),
      ]);

      const samlet = [
        ...(faktura.data || []).map((f) => ({ ...f, type: "Faktura", tabell: "fakturaer" })),
        ...(kontrakter.data || []).map((f) => ({ ...f, type: "Kontrakt", tabell: "kontrakter" })),
        ...(cv.data || []).map((f) => ({ ...f, type: "CV", tabell: "cv" })),
      ].filter((f) => f.fil);

      setFiler(samlet);
    };

    hent();
  }, [router]);

  const slett = async (id: string, tabell: string) => {
    const bekreft = confirm("Er du sikker på at du vil slette denne filen?");
    if (!bekreft) return;

    await supabase.from(tabell).delete().eq("id", id);
    router.reload();
  };

  const filtrert = filer.filter(
    (f) =>
      (!filter || f.fil.toLowerCase().includes(filter.toLowerCase())) &&
      (!typeFilter || f.type === typeFilter)
  );

  return (
    <Layout>
      <Head>
        <title>Filarkiv | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Ditt filarkiv</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 text-sm">
        <input
          type="text"
          placeholder="Søk i filnavn..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        >
          <option value="">Alle typer</option>
          <option value="Faktura">Faktura</option>
          <option value="Kontrakt">Kontrakt</option>
          <option value="CV">CV</option>
        </select>
      </div>

      {filtrert.length === 0 ? (
        <p className="text-sm text-gray-600">Ingen filer funnet.</p>
      ) : (
        <table className="w-full text-sm border border-black bg-white mb-6">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-2">Type</th>
              <th className="p-2">Fil</th>
              <th className="p-2">Dato</th>
              <th className="p-2">Handling</th>
            </tr>
          </thead>
          <tbody>
            {filtrert.map((f, i) => (
              <tr key={i} className="border-t border-black">
                <td className="p-2">{f.type}</td>
                <td className="p-2 text-xs break-all">{f.fil}</td>
                <td className="p-2">{f.opprettet_dato?.split("T")[0] || "–"}</td>
                <td className="p-2 space-x-3">
                  <a
                    href={f.fil}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    Last ned
                  </a>
                  <button
                    onClick={() => slett(f.id, f.tabell)}
                    className="text-red-600 hover:underline"
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
