import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Bell } from "lucide-react";
import getNotifications from "../lib/getNotifications"; // juster importsti hvis nødvendig

export default function NotificationBell() {
  const { user } = useUser();
  const [antall, setAntall] = useState(0);

  useEffect(() => {
    const hentVarsler = async () => {
      const brukerId = user?.id ?? user?.user_metadata?.id;
      if (!brukerId || typeof brukerId !== "string") return;

      const varsler = await getNotifications(brukerId);
      const uleste = varsler.filter((v: any) => !v.lest).length;
      setAntall(uleste);
    };

    hentVarsler();
  }, [user]);

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-black" />
      {antall > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {antall}
        </span>
      )}
    </div>
  );
}
