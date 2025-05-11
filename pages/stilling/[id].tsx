import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "../../components/Dashboard";
import supabase from "../../lib/supabaseClient";

export default function StillingDetalj() {
  const router = useRouter();
  const { id } = router.query;
  const user = useUser();

  const [stilling, setStilling] = useState<any>(null);
  const [melding, setMelding] = useState("");
  const [cvFil, setCvFil] = useState<File | null>(null);
  const [vedlegg, setVedlegg] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id) return;
    const hent = async () => {
      const { data } = await supabase
        .from("stillinger")
        .select("*")
        .eq("id", id)
        .single();
      setStilling(data);
    };
    hent();
  }, [id]);

  const sendSøknad = async () => {
    if (!user || !id) return;
    setStatus("Sender søknad...");

    let cvUrl = null;
    let vedleggUrl = null;

    if (cvFil) {
      const path = `cv/${user.id}/${Date.now()}_${cvFil.name}`;
      const { error } = await supabase.storage.from("dokumenter").upload(path, cvFil);
      if (!error) {
        cvUrl = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;
      }
    }

    if (vedlegg) {
      const path = `vedlegg/${user.id}/${Date.now()}_${vedlegg.name}`;
      const { error } = await supabase.storage.from("dokumenter").upload(path, vedlegg);
      if (!error) {
        vedleggUrl = supabase.storage.from("dokumenter").getPublicUrl(path).data.publicUrl;
      }
    }

    const { error: søkError } = await supabase.from("søknader").insert([
      {
        bruker_id: user.id,
        stilling_id: id,
        melding,
        cv_url: cvUrl,
        vedlegg_url: vedleggUrl,
      },
    ]);

    setStatus(søkError ? "Kunne ikke sende søknad" : "Søknad sendt!");
    if (!søkError) {
      setMelding("");
      setCvFil(null);
      setVedlegg(null);
    }
  };

  if (!stilling) return <Dashboard><p>Laster stilling...</p></Dashboard>;

  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{stilling.tittel}</h1>
        <p className="text-sm text-gray-700">{stilling.beskrivelse}</p>
        <p>Krav: {stilling.krav || "Ingen spesifikke krav"}</p>
        <p>Frist: {new Date(stilling.frist).toLocaleDateString()}</p>

        <div className="space-y-4 bg-white p-4 border rounded">
          <h2 className="text-lg font-bold">Send søknad</h2>

          <label className="block text-sm font-semibold">Søknadstekst</label>
          <textarea
            placeholder="Melding eller motivasjonstekst"
            value={melding}
            onChange={(e) => setMelding(e.target.value)}
            className="w-full border p-2 rounded min-h-[120px]"
          />

          <div>
            <label className="block text-sm font-medium">Last opp CV (valgfritt)</label>
            <input type="file" onChange={(e) => setCvFil(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="block text-sm font-medium">Vedlegg (valgfritt)</label>
            <input type="file" onChange={(e) => setVedlegg(e.target.files?.[0] || null)} />
          </div>

          <button
            onClick={sendSøknad}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Send søknad
          </button>

          <p className="text-green-600 text-sm">{status}</p>
        </div>
      </div>
    </Dashboard>
  );
}
