import Head from "next/head";
import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [fakturaer, setFakturaer] = useState<any[]>([]);
  const [varsler, setVarsler] = useState<any[]>([]);
  const [tjenester, setTjenester] = useState<any[]>([]);
  const [meldinger, setMeldinger] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const hentData = async () => {
      const bruker = await supabase.auth.getUser();
      const id = bruker.data.user?.id;
      if (!id) {
        router.push("/login");
        return;
      }

      const { data: fakt } = await supabase
        .from("fakturaer")
        .select("*")
        .eq("opprettet_av", id)
        .eq("status", "Ubetalt");

      const { data: vars } = await supabase
        .from("varsler")
        .select("*")
        .eq("bruker_id", id)
        .eq("lest", false);

      const { data: tjen } = await supabase
        .from("tjenester")
        .select("*")
        .eq("opprettet_av", id);

      const { data: meld } = await supabase
        .from("meldinger")
        .select("*")
        .eq("fra", id);

      setFakturaer(fakt || []);
      setVarsler(vars || []);
      setTjenester(tjen || []);
      setMeldinger(meld || []);
    };

    hentData();
  }, [router]);

  const kort = [
    {
      tittel: "Ubetalte fakturaer",
      verdi: fakturaer.length,
      tekst: "Klikk for å se og følge opp",
      href: "/faktura",
    },
    {
      tittel: "Uleste varsler",
      verdi: varsler.length,
      tekst: "Gå til varselsiden",
      href: "/varsler",
    },
    {
      tittel: "Dine tjenester",
      verdi: tjenester.length,
      tekst: "Se eller opprett nye",
      href: "/tjenester",
    },
    {
      tittel: "Sendte meldinger",
      verdi: meldinger.length,
      tekst: "Vis samtaler og innboks",
      href: "/meldinger/inbox",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Dashboard | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Mitt dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {kort.map(({ tittel, verdi, tekst, href }, i) => (
          <Link
            href={href}
            key={i}
            className="block bg-white border border-black rounded-xl p-6 hover:bg-gray-50 transition shadow"
          >
            <h2 className="font-semibold mb-1">{tittel}</h2>
            <p className="text-2xl font-bold text-blue-800">{verdi}</p>
            <p className="text-xs text-gray-600 mt-2">{tekst}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
