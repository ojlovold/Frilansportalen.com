import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { brukerHarPremium } from "@/utils/brukerHarPremium"; // ← Rettet her

export default function PersonaliaSkjema({ brukerId }: { brukerId: string }) {
  const [navn, setNavn] = useState("");
  const [fodselsdato, setFodselsdato] = useState("");
  const [kjonn, setKjonn] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telefon, setTelefon] = useState("");
  const [epost, setEpost] = useState("");
  const [lagret, setLagret] = useState(false);
  const [harPremium, setHarPremium] = useState(false);

  useEffect(() => {
    const sjekk = async () => {
      const premium = await brukerHarPremium(brukerId);
      setHarPremium(premium);
      if (!premium) return;

      const { data } = await supabase
        .from("brukerprofiler")
        .select("*")
        .eq("id", brukerId)
        .single();

      if (data) {
        setNavn(data.navn || "");
        setFodselsdato(data.fodselsdato || "");
        setKjonn(data.kjonn || "");
        setAdresse(data.adresse || "");
        setTelefon(data.telefon || "");
        setEpost(data.epost || "");
        setLagret(true);
      }
    };
    sjekk();
  }, [brukerId]);

  const lagre = async () => {
    const { error } = await supabase.from("brukerprofiler").upsert({
      id: brukerId,
      navn,
      fodselsdato,
      kjonn,
      adresse,
      telefon,
      epost,
    });

    if (!error) setLagret(true);
  };

  if (!harPremium || lagret) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 p-6 rounded mb-6 space-y-4">
      <h2 className="text-xl font-bold text-black">Fyll inn personalia</h2>

      <input
        placeholder="Fullt navn"
        className="w-full border p-2 rounded"
        value={navn}
        onChange={(e) => setNavn(e.target.value)}
      />

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={fodselsdato}
        onChange={(e) => setFodselsdato(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        value={kjonn}
        onChange={(e) => setKjonn(e.target.value)}
      >
        <option value="">Velg kjønn</option>
        <option value="Mann">Mann</option>
        <option value="Kvinne">Kvinne</option>
        <option value="Annet">Annet</option>
      </select>

      <input
        placeholder="Adresse"
        className="w-full border p-2 rounded"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />

      <input
        placeholder="Telefonnummer"
        className="w-full border p-2 rounded"
        value={telefon}
        onChange={(e) => setTelefon(e.target.value)}
      />

      <input
        placeholder="E-postadresse"
        className="w-full border p-2 rounded"
        value={epost}
        onChange={(e) => setEpost(e.target.value)}
      />

      <button
        onClick={lagre}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Lagre
      </button>
    </div>
  );
}
