import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import Dashboard from "components/Dashboard";
import supabase from "lib/supabaseClient";
import VisSøknader from "components/stillinger/VisSøknader";

export default function AdminStilling() {
  const router = useRouter();
  const { id } = router.query;
  const user = useUser();
  const [stilling, setStilling] = useState<any>(null);

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

  if (!user) return <p>Du må være innlogget.</p>;
  if (!stilling) return <Dashboard><p>Laster stilling...</p></Dashboard>;

  return (
    <Dashboard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{stilling.tittel}</h1>
        <p className="text-sm text-gray-700">{stilling.beskrivelse}</p>
        <p>Krav: {stilling.krav || "Ingen spesifikke krav"}</p>
        <p>Frist: {new Date(stilling.frist).toLocaleDateString()}</p>

        <VisSøknader stillingId={stilling.id} />
      </div>
    </Dashboard>
  );
}
