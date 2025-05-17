import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function EksporterGDPR({ brukerId }: { brukerId: string }) {
  const [status, setStatus] = useState("");

  const lastNed = async () => {
    setStatus("Henter og pakker data...");

    const zip = new JSZip();

    const fetchAndAdd = async (tabell: string, query = "") => {
      const { data } = await supabase.from(tabell).select("*" + query);
      zip.file(`${tabell}.json`, JSON.stringify(data || [], null, 2));
    };

    await fetchAndAdd("brukerprofiler", `.eq("id", "${brukerId}")`);
    await fetchAndAdd("dokumenter", `.eq("bruker_id", "${brukerId}")`);
    await fetchAndAdd("attester", `.eq("bruker_id", "${brukerId}")`);
    await fetchAndAdd("kontrakter", `.or("oppretter.eq.${brukerId},mottaker.eq.${brukerId}")`);
    await fetchAndAdd("prosjekter", `.or("eier_id.eq.${brukerId}")`);
    await fetchAndAdd("prosjektoppgaver");
    await fetchAndAdd("prosjektnotater");
    await fetchAndAdd("prosjektdeltakere", `.eq("bruker_id", "${brukerId}")`);
    await fetchAndAdd("epost", `.or("fra.eq.${brukerId},til.eq.${brukerId}")`);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `frilansportalen_gdpr_${Date.now()}.zip`);

    setStatus("Data eksportert som ZIP");
  };

  return (
    <div className="space-y-2 mt-6">
      <button onClick={lastNed} className="bg-black text-white px-4 py-2 rounded">
        Last ned alt som ZIP (GDPR)
      </button>
      <p className="text-sm text-green-600">{status}</p>
    </div>
  );
}
