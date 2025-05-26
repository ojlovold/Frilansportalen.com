// pages/auth/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Feil under innlogging:", error.message);
        router.replace("/logginn?feil=auth");
      } else {
        // Redirect til ønsket side etter e-postverifisering
        router.replace("/admin");
      }
    };

    handleAuthRedirect();
  }, [router, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center text-center text-lg">
      Vennligst vent, logger deg inn ...
    </main>
  );
}
