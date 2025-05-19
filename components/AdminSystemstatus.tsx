// components/AdminSystemstatus.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AdminWrapper from "@/components/AdminWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ModulStatus {
  id: number;
  modul: string;
  aktiv: boolean;
  kommentar: string;
}

export default function AdminSystemstatus() {
  const [moduler, setModuler] = useState<ModulStatus[]>([]);

  useEffect(() => {
    const hentStatus = async () => {
      const { data } = await supabase.from("systemstatus").select("*");
      if (data) setModuler(data);
    };
    hentStatus();
  }, []);

  const toggleModul = async (id: number, aktiv: boolean) => {
    const oppdatert = moduler.map((m) =>
      m.id === id ? { ...m, aktiv: !aktiv } : m
    );
    setModuler(oppdatert);
    await supabase.from("systemstatus").update({ aktiv: !aktiv }).eq("id", id);
  };

  return (
    <AdminWrapper title="Systemstatus">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {moduler.map((modul) => (
          <Card key={modul.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {modul.modul}
                  </p>
                  <p className="text-xs text-gray-600">{modul.kommentar}</p>
                </div>
                <Switch
                  checked={modul.aktiv}
                  onCheckedChange={() => toggleModul(modul.id, modul.aktiv)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminWrapper>
  );
}
