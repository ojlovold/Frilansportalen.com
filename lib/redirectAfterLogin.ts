// lib/redirectAfterLogin.ts
import { supabase } from "@/lib/supabaseClient";
import { NextRouter } from "next/router";

export async function redirectAfterLogin(router: NextRouter) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  // Sjekk om brukeren har lagret profilinfo (som navn)
  const { data: profil } = await supabase
    .from("profiler")
    .select("navn")
    .eq("id", user.id)
    .single();

  if (!profil || !profil.navn) {
    router.push("/profil-info"); // Send til profilsiden første gang
  } else {
    router.push("/dashboard"); // Send videre til hoveddashboard
  }
}
