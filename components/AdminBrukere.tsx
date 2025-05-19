// components/AdminBrukere.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Bruker {
  id: string;
  email: string;
  created_at: string;
  rolle: string;
  status: string;
}

export default function AdminBrukere() {
  const [brukere, setBrukere] = useState<Bruker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hentBrukere = async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (data?.users) {
        const userIds = data.users.map((u) => u.id);
        const { data: profiler } = await supabase
          .from("brukerprofiler")
          .select("user_id, rolle, status")
          .in("user_id", userIds);

        const transformert = data.users.map((user) => {
          const profil = profiler?.find((p) => p.user_id === user.id);
          return {
            id: user.id,
            email: user.email ?? "(ukjent)",
            created_at: user.created_at ?? "",
            rolle: profil?.rolle ?? "ukjent",
            status: profil?.status ?? "ukjent",
          };
        });
        setBrukere(transformert);
      }
      setLoading(false);
    };
    hentBrukere();
  }, []);

  const oppdaterBruker = async (id: string, rolle: string, status: string) => {
    const { error } = await supabase.from("brukerprofiler").upsert({
      user_id: id,
      rolle,
      status,
    });
    if (!error) alert("Bruker oppdatert");
    else alert("Feil ved oppdatering: " + error.message);
  };

  const roller = ["frilanser", "arbeidsgiver", "privatperson"];
  const statuser = ["aktiv", "skjult", "ufullstendig"];

  const handleChange = (index: number, key: "rolle" | "status", value: string) => {
    const kopi = [...brukere];
    (kopi[index] as any)[key] = value;
    setBrukere(kopi);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Alle brukere</h2>
      {loading ? (
        <p>Laster brukere...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {brukere.map((b, index) => (
            <Card key={b.id}>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-medium">{b.email}</p>
                <p className="text-xs text-gray-600">ID: {b.id}</p>
                <p className="text-xs text-gray-600">
                  Opprettet: {new Date(b.created_at).toLocaleString()}
                </p>
                <div>
                  <Label htmlFor={`rolle-${index}`}>Rolle</Label>
                  <select
                    id={`rolle-${index}`}
                    value={b.rolle}
                    onChange={(e) => handleChange(index, "rolle", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {roller.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor={`status-${index}`}>Status</Label>
                  <select
                    id={`status-${index}`}
                    value={b.status}
                    onChange={(e) => handleChange(index, "status", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  >
                    {statuser.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={() => oppdaterBruker(b.id, b.rolle, b.status)}>
                  Lagre endringer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
