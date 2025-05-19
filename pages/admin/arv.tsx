// pages/admin/arv.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/AdminWrapper";

export default function AdminArv() {
  const [epost, setEpost] = useState("");
  const [navn, setNavn] = useState("");
  const [telefon, setTelefon] = useState("");
  const [status, setStatus] = useState<"klar" | "lagret" | "feil">("klar");

  useEffect(() => {
    const hentArver = async () => {
      const { data } = await supabase.from("admin_config").select("arver_epost, arver_navn, arver_telefon").eq("id", 1).single();
      if (data?.arver_epost) setEpost(data.arver_epost);
      if (data?.arver_navn) setNavn(data.arver_navn);
      if (data?.arver_telefon) setTelefon(data.arver_telefon);
    };
    hentArver();
  }, []);

  const lagre = async () => {
    const { error } = await supabase.from("admin_config").upsert({
      id: 1,
      arver_epost: epost,
      arver_navn: navn,
      arver_telefon: telefon,
    });
    setStatus(error ? "feil" : "lagret");
  };

  return (
    <AdminWrapper title="Arverett og eierskap">
      <div className="bg-white p-6 rounded-xl shadow max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Navn på arving</label>
          <input
            type="text"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            placeholder="Fullt navn"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-post til arving</label>
          <input
            type="email"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            placeholder="fornavn@epost.no"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefonnummer</label>
          <input
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder="+47 123 45 678"
            className="w-full border rounded p-2"
          />
        </div>
        <p className="text-sm text-gray-600">
          Hvis du ikke er aktiv på 60 dager, vil systemet automatisk forsøke å overføre eierskap til denne personen. De vil motta en overføringslenke via e-post eller Messenger.
        </p>
        <button onClick={lagre} className="bg-black text-white px-4 py-2 rounded">
          Lagre arverett
        </button>
        {status === "lagret" && <p className="text-green-600 mt-2">Lagret.</p>}
        {status === "feil" && <p className="text-red-600 mt-2">Kunne ikke lagre.</p>}
      </div>
    </AdminWrapper>
  );
}
