// pages/admin/systemstatus.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminSystemstatus from "@/components/AdminSystemstatus";
import AdminWrapper from "@/components/layout/AdminLayout";

interface Integrasjon {
  id: string;
  aktiv: boolean;
  api_key?: string;
  client_id?: string;
  client_secret?: string;
  orgnr?: string;
  sist_oppdatert?: string;
}

export default function AdminSystemstatusPage() {
  const [data, setData] = useState<Integrasjon[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("integrasjoner").select("*");
      if (data) setData(data);
    };
    hent();
  }, []);

  const erGyldig = (item: Integrasjon) =>
    item.api_key &&
    (item.id !== "altinn" || item.orgnr) &&
    (item.id !== "vipps" || (item.client_id && item.client_secret)) &&
    item.aktiv;

  return (
    <AdminWrapper title="Systemstatus">
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Modulstatus</h2>
        <AdminSystemstatus />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Integrasjoner</h2>
        <div className="grid gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded shadow ${
                erGyldig(item) ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="text-lg font-semibold capitalize">{item.id}</p>
              <p>Status: {item.aktiv ? "Aktiv" : "Inaktiv"}</p>
              <p>
                Sist oppdatert:{" "}
                {item.sist_oppdatert
                  ? new Date(item.sist_oppdatert).toLocaleString("no-NO")
                  : "–"}
              </p>
              <p className="text-sm text-gray-700">
                {erGyldig(item)
                  ? "Integrasjon er klar til bruk."
                  : "Manglende data – sjekk admin/innstillinger."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AdminWrapper>
  );
}
