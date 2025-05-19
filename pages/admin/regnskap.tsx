// pages/admin/regnskap.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/AdminWrapper";

export default function AdminRegnskap() {
  const [inntekter, setInntekter] = useState<any[]>([]);
  const [sumInntekt, setSumInntekt] = useState<number>(0);

  useEffect(() => {
    const hent = async () => {
      const { data } = await supabase.from("transaksjoner").select("*");
      setInntekter(data || []);
      const sum = data?.reduce((acc, curr) => acc + (curr.belop || 0), 0) || 0;
      setSumInntekt(sum);
    };
    hent();
  }, []);

  return (
    <AdminWrapper title="Regnskap og rapportering">
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">Inntekter</h2>
          <p className="text-sm text-gray-700 mb-4">
            Her vises dine inntekter fra portalen, inkludert betalinger via Stripe og Vipps.
          </p>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <p className="text-sm">Totalt: {sumInntekt.toFixed(2)} kr</p>
            <p className="text-sm">MVA (25%): {(sumInntekt * 0.25).toFixed(2)} kr</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Utgifter og kvitteringer</h2>
          <p className="text-sm text-gray-700 mb-4">
            Du kan laste opp kjøp i alle valutaer. Systemet vil automatisk hente valutakurs og regne ut NOK-verdi.
          </p>
          <div className="bg-white p-4 rounded-xl shadow max-w-3xl">
            <form className="space-y-4">
              <input type="text" placeholder="Tittel / beskrivelse" className="w-full border rounded p-2" />
              <input type="number" step="any" placeholder="Beløp" className="w-full border rounded p-2" />
              <input type="text" placeholder="Valuta (f.eks. EUR, USD, GBP)" className="w-full border rounded p-2" />
              <input type="date" className="w-full border rounded p-2" />
              <input type="file" accept=".jpg,.png,.pdf" className="w-full" />
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded"
              >
                Last opp utgift
              </button>
            </form>
          </div>
        </section>
      </div>
    </AdminWrapper>
  );
}
