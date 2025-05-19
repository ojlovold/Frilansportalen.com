import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Farger = {
  bakgrunnsfarge: string;
  tekstfarge: string;
};

export default function useDesignFarger(): Farger {
  const [farger, setFarger] = useState<Farger>({
    bakgrunnsfarge: "bg-portalGul",
    tekstfarge: "text-black",
  });

  useEffect(() => {
    const hent = async () => {
      const { data, error } = await supabase
        .from("designinnstillinger")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setFarger({
          bakgrunnsfarge: data.bakgrunnsfarge || "bg-portalGul",
          tekstfarge: data.tekstfarge || "text-black",
        });
      }
    };

    hent();
  }, []);

  return farger;
}
