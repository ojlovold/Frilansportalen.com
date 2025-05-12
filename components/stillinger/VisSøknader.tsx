import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function VisSøknader({ stillingId }: { stillingId: string }) {
  const user = useUser();
  const [erEier, setErEier] = useState(false);
  const [søknader, setSøknader] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  const brukerId = user && "id" in user ? (user.id as string) : null;

  useEffect(() => {
    const hent = async () => {
      if (!brukerId) return;

      const { data: stilling } = await supabase
        .from("stillinger")
        .select("arbeidsgiver_id")
        .eq("id", stillingId)
        .single();

      if (stilling?.arbeidsgiver_id !== brukerId) {
        setErEier(false);
        return;
      }

      setErEier(true);

      const { data } = await supabase
        .from("søknader")
        .select("*, bruker:brukerprofiler(navn, epost), stilling:stillinger(tittel)")
        .eq("stilling_id", stillingId)
        .order("sendt", { ascending: false });

      setSøknader(data || []);
    };

    hent();
  }, [brukerId, stillingId]);

  const oppdaterStatus = async (id: string, nyStatus: string) => {
    const søknad = søknader.find((s) => s.id === id);
    if (!søknad) return;

    const { error } = await supabase
      .from("søknader")
      .update({ status: nyStatus })
      .eq("id", id);

    if (!error) {
      setSøknader((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nyStatus } : s))
      );
      setStatus("Status oppdatert");

      const melding = `Søknadsstatusen din er oppdatert til "${nyStatus}" for stillingen "${søknad.stilling?.tittel || "ukjent"}".`;

      await supabase.from("varsler").insert([
        {
          bruker_id: søknad.bruker_id,
          type: "søknad",
          tekst: melding,
          lenke: `/profil`,
        },
      ]);

      if (søknad.bruker?.epost) {
        await fetch("/api/send-varsling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: søknad.bruker.epost,
            subject: "Oppdatert søknadsstatus",
            text: melding,
          }),
        });
      }
    }
  };

  if (!erEier) return <p>Du har ikke tilgang til søknadene for denne stillingen.</p>;

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-xl font-bold">Mottatte søknader</h2>
      {søknader.length === 0 ? (
        <p>Ingen søknader mottatt ennå.</p>
      ) : (
        <ul className="space-y-4">
          {søknader.map((s) => (
            <li key={s.id} className="border p-4 rounded bg-white text-black shadow-sm space-y-1">
              <p><strong>Søker:</strong> {s.bruker?.navn || s.bruker_id}</p>
              <p><strong>E-post:</strong> {s.bruker?.epost || "Ukjent"}</p>
              <p><strong>Status:</strong> {s.status}</p>
              <p><strong>Melding:</strong> {s.melding || "-"}</p>

              {s.cv_url && (
                <p><strong>CV:</strong> <a href={s.cv_url} target="_blank" className="underline text-blue-600">Last ned</a></p>
              )}
              {s.vedlegg_url && (
                <p><strong>Vedlegg:</strong> <a href={s.vedlegg_url} target="_blank" className="underline text-blue-600">Last ned</a></p>
              )}

              <div className="flex gap-2 mt-2">
                {["vurderes", "intervju", "ansatt", "avslag"].map((valg) => (
                  <button
                    key={valg}
                    onClick={() => oppdaterStatus(s.id, valg)}
                    className="bg-black text-white px-3 py-1 rounded text-sm"
                  >
                    {valg}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      {status && <p className="text-green-600 text-sm">{status}</p>}
    </div>
  );
}
