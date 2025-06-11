// lib/redirectAfterLogin.ts
import { supabase } from "@/lib/supabaseClient";

export async function redirectAfterLogin(userId: string, router: any) {
  const { data: profil } = await supabase
    .from("profiler")
    .select("navn")
    .eq("id", userId)
    .single();

  if (!profil?.navn) {
    router.push("/profil-info");
  } else {
    router.push("/dashboard");
  }
}
