import Head from "next/head";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Status() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sjekkInnlogging = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    sjekkInnlogging();
  }, [router]);

  if (loading) return <Layout><p className="text-sm">Laster status...</p></Layout>;

  const moduler = [
    { navn: "Dashboard", status: "Ferdig" },
    { navn: "Meldinger", status: "Ferdig" },
    { navn: "Gjenbruksportal", status: "Ferdig" },
    { navn: "Tjenester", status: "Ferdig" },
    { navn: "Faktura", status: "Ferdig" },
    { navn: "Reise", status: "Ferdig" },
    { navn: "Stillinger", status: "Ferdig" },
    { navn: "Kurs", status: "Ferdig" },
    { navn: "AI-assistent", status: "Ferdig" },
    { navn: "Betaling", status: "Delvis" },
    { navn: "Systemlogg", status: "Ferdig" },
    { navn: "Anbud", status: "Ferdig" },
    { navn: "Diesel & transport", status: "Ferdig" },
    { navn: "Arkiv", status: "Ferdig" },
    { navn: "Kontrakter", status: "Ferdig" },
    { navn: "Chat", status: "Ferdig" },
    { navn: "Kalender", status: "Ferdig" },
    { navn: "Roller", status: "Ferdig" },
    { navn: "Admin", status: "Ferdig" },
    { navn: "Feilmelding & forslag", status: "Ferdig" },
    { navn: "Innstillinger", status: "Ferdig" },
    { navn: "Analyse", status: "Ferdig" },
  ];

  return (
    <Layout>
      <Head>
        <title>Statusoversikt | Frilansportalen</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Modulstatus</h1>

      <table className="w-full text-sm border border-black bg-white">
        <thead>
          <tr className="bg-black text-white text-left">
            <th className="p-2">Modul</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {moduler.map(({ navn, status }, i) => (
            <tr key={i} className="border-t border-black">
              <td className="p-2">{navn}</td>
              <td className={`p-2 font-semibold ${
                status === "Ferdig" ? "text-green-700" :
                status === "Delvis" ? "text-yellow-600" : "text-red-600"
              }`}>
                {status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
