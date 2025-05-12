import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type ProsjektDeltakelse = {
  prosjekt: {
    navn: string;
    status: string;
    frist: string;
  }[]; // NB: array!
};

export default function LagCV({ brukerId }: { brukerId: string }) {
  const [ferdigheter, setFerdigheter] = useState<string[]>([]);
  const [nyeFerdigheter, setNyeFerdigheter] = useState<string[]>([]);
  const [valg, setValg] = useState({ språk: "", utdanning: "" });
  const [egne, setEgne] = useState({ språk: "", utdanning: "", erfaring: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data: forslag } = await supabase
        .from("cv_forslag")
        .select("*")
        .eq("id", "global")
        .single();
      if (forslag) setFerdigheter(forslag.ferdigheter || []);

      const { data: prosjekter } = await supabase
        .from("prosjektdeltakere")
        .select("prosjekt:prosjekter(navn, status, frist)")
        .eq("bruker_id", brukerId);

      const fullførte = (prosjekter as ProsjektDeltakelse[])
        ?.filter((p) => p.prosjekt[0]?.status === "fullført")
        .map((p) => `Prosjekt: ${p.prosjekt[0].navn} – Frist: ${p.prosjekt[0].frist}`);

      setEgne((prev) => ({
        ...prev,
        erfaring: [prev.er
