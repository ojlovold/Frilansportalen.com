import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "@/lib/supabaseClient";
import Dashboard from "@/components/Dashboard";
import SkrivSøknad from "@/components/profil/SkrivSøknad";

export default function StillingsVisning() {
  const router = useRouter();
  const { id } = router.query;
  const user = useUser();

  const [stilling, setStilling] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const hentStilling = async () => {
      const { data } = await supabase
        .from("stillinger")
        .select("*")
        .eq("id", id)
        .single();
      setStilling(data);
    };
    hentStilling();
  }, [id]);

  if (!stilling) return <p>Laster stilling...</p>;
  if (!user) return <p>Du må være innlogget for å søke.</p>;

  return (
    <Dashboard>
      <h1 className="text-2xl font-bold mb-4">{stilling.tittel}</h1>
      <p className="mb-6">{stilling.beskrivelse}</p>

      <SkrivSøknad
        brukerId={user.id}
        stillingId={stilling.id}
        stillingstittel={stilling.tittel}
      />
    </Dashboard>
  );
}
