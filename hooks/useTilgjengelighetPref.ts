import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";

export default function useTilgjengelighetPref() {
  const user = useUser();
  const [språk, setSpråk] = useState("nb");
  const [opplesing, setOpplesing] = useState(false);

  // Last fra localStorage
  useEffect(() => {
    const localSpråk = localStorage.getItem("sprak");
    const localOpplesing = localStorage.getItem("opplesing");

    if (localSpråk) setSpråk(localSpråk);
    if (localOpplesing === "true") setOpplesing(true);
  }, []);

  // Synkroniser til brukerprofil etter innlogging
  useEffect(() => {
    const brukerId = user && "id" in user ? (user.id as string) : null;
    if (!brukerId) return;

    supabase
      .from("brukerprofiler")
      .update({ sprak: språk, opplesing_aktivert: opplesing })
      .eq("id", brukerId);
  }, [user, språk, opplesing]);

  // Lagre til localStorage og oppdater global lesefunksjon
  useEffect(() => {
    localStorage.setItem("sprak", språk);
    localStorage.setItem("opplesing", String(opplesing));

    window.lesTekst = (tekst: string) => {
      if (!opplesing || !tekst) return;
      const u = new SpeechSynthesisUtterance(tekst);
      u.lang = språk === "nb" ? "no-NO" : "en-US";
      window.speechSynthesis.speak(u);
    };
  }, [språk, opplesing]);

  return { språk, setSpråk, opplesing, setOpplesing };
}
