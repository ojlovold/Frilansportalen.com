// lib/redirectAfterLogin.ts
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export async function redirectEtterInnlogging(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return "/login";

  const brukerId = session.user.id;
  const { data: profil } = await supabase
    .from("profiler")
    .select("navn")
    .eq("id", brukerId)
    .single();

  return profil?.navn ? "/dashboard" : "/registrer-informasjon";
}
