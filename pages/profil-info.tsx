// pages/profil-info.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ProfilInfo() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [navn, setNavn] = useState("");
  const [telefon, setTelefon] = useState("");
  const [bilde, setBilde] = useState<File | null>(null);
  const [kjonn, setKjonn] = useState("");
  const [nasjonalitet, setNasjonalitet] = useState("");
  const [fodsel, setFodsel] = useState("");
  const [adresse, setAdresse] = useState("");
  const [postnummer, setPostnummer] = useState("");
  const [poststed, setPoststed] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hentProfil = async () => {
      const { data: profil } = await supabase
        .from("profiler")
        .select("navn")
        .eq("id", user?.id)
        .single();

      if (profil?.navn) {
        router.push("/dashboard");
      }
    };

    if (user) hentProfil();
  }, [user]);

  const hentPoststed = async (postnr: string) => {
    if (postnr.length === 4) {
      try {
        const res = await fetch(`https://api.bring.com/shippingguide/api/postalCode.json?clientUrl=frilansportalen.com&pnr=${postnr}`);
        const data = await res.json();
        if (data.result) setPoststed(data.result);
      } catch {
        setPoststed("");
      }
    }
  };

  const lagre = async () => {
    if (!user) return;
    setStatus("Lagrer...");

    let bildeUrl = null;
    if (bilde) {
      const filnavn = `${user.id}/profilbilde.${bilde.name.split(".").pop()}`;
      const { data, error } = await supabase.storage.from("profilbilder").upload(filnavn, bilde, {
        upsert: true,
        contentType: bilde.type,
      });
      if (error) {
        setStatus("❌ Feil ved opplasting av bilde");
        return;
      }
      bildeUrl = supabase.storage.from("profilbilder").getPublicUrl(filnavn).data.publicUrl;
    }

    const { error } = await supabase.from("profiler").upsert({
      id: user.id,
      navn,
      telefon,
      bilde: bildeUrl,
      kjonn,
      nasjonalitet,
      fodselsdato: fodsel,
      adresse,
      postnummer,
      poststed,
      epost: user.email,
    });

    if (error) {
      setStatus("❌ Feil ved lagring: " + error.message);
    } else {
      setStatus("✅ Lagret");
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8] text-black p-6">
      <Head>
        <title>Fullfør profil | Frilansportalen</title>
      </Head>

      <div className="max-w-xl mx-auto bg-white/80 backdrop-blur p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Fullfør profilen din</h1>

        <label className="block font-semibold">Fullt navn</label>
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Telefonnummer</label>
        <input
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Adresse</label>
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Postnummer</label>
        <input
          type="text"
          value={postnummer}
          onChange={(e) => {
            setPostnummer(e.target.value);
            hentPoststed(e.target.value);
          }}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        {poststed && (
          <p className="text-sm text-black/60 mb-4">Poststed: {poststed}</p>
        )}

        <label className="block font-semibold">Fødselsdato</label>
        <input
          type="date"
          value={fodsel}
          onChange={(e) => setFodsel(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Kjønn</label>
        <select
          value={kjonn}
          onChange={(e) => setKjonn(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        >
          <option value="">Velg...</option>
          <option value="kvinne">Kvinne</option>
          <option value="mann">Mann</option>
          <option value="ikke-binær">Ikke-binær</option>
          <option value="transperson">Transperson</option>
          <option value="annet">Annet</option>
          <option value="vil ikke oppgi">Vil ikke oppgi</option>
        </select>

        <label className="block font-semibold">Nasjonalitet</label>
        <input
          type="text"
          value={nasjonalitet}
          onChange={(e) => setNasjonalitet(e.target.value)}
          className="w-full p-3 rounded border border-gray-300 mb-4"
        />

        <label className="block font-semibold">Profilbilde</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBilde(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={lagre}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Lagre informasjon
        </button>

        {status && <p className="mt-4 text-sm text-center">{status}</p>}
      </div>
    </main>
  );
}
