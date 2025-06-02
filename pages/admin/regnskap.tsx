// pages/admin/regnskap.tsx – vis NOK også for norske beløp i NOK-kolonnen

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminLayout from "@/components/layout/AdminLayout";
import AutoUtfyllKvitteringSmart from "@/components/AutoUtfyllKvitteringSmart";

export default function AdminRegnskap() {
  const [inntekter, setInntekter] = useState<any[]>([]);
  const [sumInntekt, setSumInntekt] = useState<number>(0);
  const [utgifter, setUtgifter] = useState<any[]>([]);

  useEffect(() => {
    const hent = async () => {
      const { data: inntekter } = await supabase.from("transaksjoner").select("*");
      const { data: utgifter } = await supabase.from("kvitteringer").select("*").eq("slettet", false);
      setInntekter(inntekter || []);
      setUtgifter(utgifter || []);
      const sum = inntekter?.reduce((acc, curr) => acc + (curr.belop || 0), 0) || 0;
      setSumInntekt(sum);
    };
    hent();
  }, []);

  const totalUtgiftNOK = utgifter.reduce(
    (acc, u) => acc + (u.nok ?? (u.valuta === "NOK" ? u.belop : 0)),
    0
  );
  const netto = sumInntekt - totalUtgiftNOK;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold mb-6">Regnskap</h1>

        <section>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <p className="text-sm">Totalt: {sumInntekt.toFixed(2)} kr</p>
            <p className="text-sm">MVA (25%): {(sumInntekt * 0.25).toFixed(2)} kr</p>
            {sumInntekt >= 50000 && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                Du har passert 50 000 kr i inntekt. Du må nå registrere virksomheten i Merverdiavgiftsregisteret.
              </p>
            )}
          </div>
        </section>

        <section>
          <AutoUtfyllKvitteringSmart />
        </section>

        <section>
          <div className="bg-white p-4 rounded-xl shadow max-w-6xl">
            <p className="text-sm">Totale utgifter: {totalUtgiftNOK.toFixed(2)} kr</p>
            <p className="text-sm">Netto resultat: {netto.toFixed(2)} kr</p>
            <div className="overflow-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Dato</th>
                    <th className="text-left p-2">Tittel</th>
                    <th className="text-left p-2">Beløp</th>
                    <th className="text-left p-2">Valuta</th>
                    <th className="text-left p-2">NOK</th>
                    <th className="text-left p-2">Kvittering</th>
                  </tr>
                </thead>
                <tbody>
                  {utgifter.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2">{u.dato}</td>
                      <td className="p-2">{u.tittel}</td>
                      <td className="p-2">{u.belop_original ?? u.belop} {u.valuta}</td>
                      <td className="p-2">{u.valuta}</td>
                      <td className="p-2">
                        {(u.nok ?? (u.valuta === "NOK" ? u.belop : ""))?.toFixed(2)}
                      </td>
                      <td className="p-2">
                        {u.fil_url ? (
                          <a
                            href={u.fil_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Vis
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
