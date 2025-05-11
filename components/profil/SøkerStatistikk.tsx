import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function SøkerStatistikk({ brukerId }: { brukerId: string }) {
  const [data, setData] = useState({
    totalt: 0,
    intervju: 0,
    avslag: 0,
    ansatt: 0,
  });

  useEffect(() => {
    const hent = async () => {
      const { count: totalt } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .eq("bruker_id", brukerId);

      const { count: intervju } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .eq("bruker_id", brukerId)
        .eq("status", "intervju");

      const { count: avslag } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .eq("bruker_id", brukerId)
        .eq("status", "avslag");

      const { count: ansatt } = await supabase
        .from("søknader")
        .select("*", { count: "exact", head: true })
        .eq("bruker_id", brukerId)
        .eq("status", "ansatt");

      setData({
        totalt: totalt || 0,
        intervju: intervju || 0,
        avslag: avslag || 0,
        ansatt: ansatt || 0,
      });
    };

    hent();
  }, [brukerId]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Søknadsstatistikk</h2>
      <ul className="text-black space-y-1">
        <li>Totalt sendt: <strong>{data.totalt}</strong></li>
        <li>Intervju: <strong>{data.intervju}</strong></li>
        <li>Ansettelser: <strong>{data.ansatt}</strong></li>
        <li>Avslag: <strong>{data.avslag}</strong></li>
      </ul>
    </div>
  );
}
