import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import supabase from "@/lib/supabaseClient";
import MeldDegTilDugnad from "@/components/dugnad/MeldDegTilDugnad";
import DugnadSvarListe from "@/components/dugnad/DugnadSvarListe";

export default function DugnadDetalj() {
  const router = useRouter();
  const { id } = router.query;
  const [dugnad, setDugnad] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const hent = async () => {
      const { data } = await supabase
        .from("dugnader")
        .select("*")
        .eq("id", id)
        .single();
      setDugnad(data);
    };

    hent();
  }, [id]);

  if (!dugnad) return <Dashboard><p>Laster dugnad...</p></Dashboard>;

  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{dugnad.tittel}</h1>
        <p className="text-sm text-gray-700">{dugnad.beskrivelse}</p>
        <p>Kategori: {dugnad.kategori || "-"}</p>
        <p>Sted: {dugnad.sted || "-"}</p>
        <p>Frist: {dugnad.frist ? new Date(dugnad.frist).toLocaleDateString() : "-"}</p>
        <p className="text-sm text-gray-500">Type: {dugnad.type}</p>

        <MeldDegTilDugnad dugnadId={dugnad.id} />
        <DugnadSvarListe dugnadId={dugnad.id} />
      </div>
    </Dashboard>
  );
}
