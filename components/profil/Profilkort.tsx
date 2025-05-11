import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Profilkort({ userId }: { userId: string }) {
  const [profil, setProfil] = useState<any>({
    navn: "",
    epost: "",
    telefon: "",
    adresse: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase
        .from("brukerprofiler")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) setProfil(data);
    };
    hent();
  }, [userId]);

  const oppdater = async () => {
    const { error } = await supabase
      .from("brukerprofiler")
      .update(profil)
      .eq("id", userId);

    setStatus(error ? "Kunne ikke lagre" : "Lagret!");
  };

  const les = (tekst: string) => {
    if (typeof window !== "undefined" && window.lesTekst) {
      window.lesTekst(tekst);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded">
      <h2 className="text-xl font-bold">Min profil</h2>

      <div>
        <label onMouseEnter={() => les("Navn")} className="block font-medium">Navn</label>
        <input
          value={profil.navn || ""}
          onChange={(e) => setProfil({ ...profil, navn: e.target.value })}
          className="w-full border p-2 rounded"
          onFocus={() => les("Skriv inn ditt navn")}
        />
      </div>

      <div>
        <label onMouseEnter={() => les("E-post")} className="block font-medium">E-post</label>
        <input
          value={profil.epost || ""}
          onChange={(e) => setProfil({ ...profil, epost: e.target.value })}
          className="w-full border p-2 rounded"
          onFocus={() => les("Skriv inn din e-postadresse")}
        />
      </div>

      <div>
        <label onMouseEnter={() => les("Telefonnummer")} className="block font-medium">Telefon</label>
        <input
          value={profil.telefon || ""}
          onChange={(e) => setProfil({ ...profil, telefon: e.target.value })}
          className="w-full border p-2 rounded"
          onFocus={() => les("Skriv inn ditt telefonnummer")}
        />
      </div>

      <div>
        <label onMouseEnter={() => les("Adresse")} className="block font-medium">Adresse</label>
        <input
          value={profil.adresse || ""}
          onChange={(e) => setProfil({ ...profil, adresse: e.target.value })}
          className="w-full border p-2 rounded"
          onFocus={() => les("Skriv inn din adresse")}
        />
      </div>

      <button
        onClick={oppdater}
        onMouseEnter={() => les("Lagre profil")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Lagre profil
      </button>

      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
