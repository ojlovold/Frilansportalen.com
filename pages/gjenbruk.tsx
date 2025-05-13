import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

type Gjenbruksobjekt = {
  id: string;
  tittel: string;
  sted: string;
  kategori: string;
  beskrivelse: string;
  pris: number;
};

type Filter = {
  sted: string;
  kategori: string;
};

export default function Gjenbruk() {
  const [objekter, setObjekter] = useState<Gjenbruksobjekt[]>([]);
  const [filtrert, setFiltrert] = useState<Gjenbruksobjekt[]>([]);
  const [filter, setFilter] = useState<Filter>({ sted: "", kategori: "" });

  useEffect(() => {
    const hentData = async () => {
      const { data, error } = await supabase.from("gjenbruk").select("*");
      if (!error && data) {
        setObjekter(data);
        setFiltrert(data);
      }
    };
    hentData();
  }, []);

  useEffect(() => {
    const resultat = objekter.filter((obj) => {
      return (
        (filter.sted === "" || obj.sted === filter.sted) &&
        (filter.kategori === "" || obj.kategori === filter.kategori)
      );
    });

    setFiltrert(resultat);
  }, [filter, objekter]);

  const unike = (felt: keyof Filter) =>
    Array.from(new Set(objekter.map((o) => o[felt])));

  const filtrerbareFelter: (keyof Filter)[] = ["sted", "kategori"];

  return (
    <>
      <Head>
        <title>Gjenbruk | Frilansportalen</title>
        <meta name="description" content="Gi bort eller hent gratis ting i ditt nærområde" />
      </Head>
      <main className="bg-portalGul min-h-screen p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Gjenbruksportalen</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filtrerbareFelter.map((felt) => (
            <select
              key={felt}
              value={filter[felt]}
              onChange={(e) =>
                setFilter({ ...filter, [felt]: e.target.value })
              }
              className="p-2 rounded border"
            >
              <option value="">{felt[0].toUpperCase() + felt.slice(1)}</option>
              {unike(felt).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ))}
        </div>

        <div className="grid gap-6">
          {filtrert.length === 0 && <p>Ingen oppføringer matcher filtrene.</p>}
          {filtrert.map((obj) => (
            <div key={obj.id} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{obj.tittel}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {obj.sted} | {obj.kategori} | {obj.pris === 0 ? "Gratis" : `${obj.pris} kr`}
              </p>
              <p>{obj.beskrivelse}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
