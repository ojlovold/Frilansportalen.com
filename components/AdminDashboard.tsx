import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const user = useUser();
  const router = useRouter();

  const [stats, setStats] = useState<any>({});
  const [vippsKey, setVippsKey] = useState("");
  const [altinnKey, setAltinnKey] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#FFD700");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [modules, setModules] = useState<any>({});
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: inntekter } = await supabase.rpc("hent_admininntekter");
      const { data: brukere } = await supabase.from("profiler").select("id");
      const { data: lansert } = await supabase.from("innstillinger").select("publisert").single();
      const { data: config } = await supabase.from("admin_config").select("*").single();
      const { data: moduler } = await supabase.from("modul_toggle").select("*").single();
      const { data: adminVarsel } = await supabase.from("admin_meldinger").select("*").single();

      setStats({
        inntekter: inntekter ?? 0,
        brukere: brukere?.length ?? 0,
        publisert: lansert?.publisert ?? false,
      });

      if (config) {
        setVippsKey(config.vippsApiKey || "");
        setAltinnKey(config.altinnApiKey || "");
        setPrimaryColor(config.primaryColor || "#FFD700");
        setSecondaryColor(config.secondaryColor || "#000000");
        setLogoUrl(config.logoUrl || "");
      }

      if (moduler) setModules(moduler);
      if (adminVarsel?.melding) setAdminMessage(adminVarsel.melding);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const toggleLansering = async () => {
    const nyStatus = !stats.publisert;
    await supabase.from("innstillinger").update({ publisert: nyStatus }).eq("id", 1);
    setStats((s: any) => ({ ...s, publisert: nyStatus }));
  };

  const toggleModule = async (key: string) => {
    const newValue = !modules[key];
    const newModules = { ...modules, [key]: newValue };
    setModules(newModules);
    await supabase.from("modul_toggle").update(newModules).eq("id", 1);
  };

  const handleSave = async () => {
    let uploadedLogoUrl = logoUrl;

    if (selectedLogo) {
      const { data, error } = await supabase.storage
        .from("logos")
        .upload(`logo-${Date.now()}`, selectedLogo, {
          cacheControl: "3600",
          upsert: true,
        });

      if (data) {
        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(data.path);
        if (urlData?.publicUrl) {
          uploadedLogoUrl = urlData.publicUrl;
          setLogoUrl(urlData.publicUrl);
        }
      } else {
        console.error("Logo-opplasting feilet", error);
      }
    }

    await supabase.from("admin_config").upsert({
      id: 1,
      vippsApiKey: vippsKey,
      altinnApiKey: altinnKey,
      primaryColor,
      secondaryColor,
      logoUrl: uploadedLogoUrl,
    });

    await supabase.from("admin_meldinger").upsert({
      id: 1,
      melding: adminMessage,
    });

    alert("Endringer lagret");
  };

  if (!user) return <p>Logger inn...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Adminpanel</h1>

      <Card>
        <CardContent className="space-y-2 p-4">
          <p>Totale inntekter: {stats.inntekter} kr</p>
          <p>Antall brukere: {stats.brukere}</p>
          <Button onClick={toggleLansering}>
            {stats.publisert ? "Stopp lansering" : "Publiser Frilansportalen"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Modulkontroll</h2>
          {["ocr", "ai", "kart", "booking", "betaling", "altinn", "pdf"].map((modul) => (
            <div key={modul} className="flex items-center justify-between">
              <Label>{modul.toUpperCase()}</Label>
              <Switch checked={modules[modul]} onCheckedChange={() => toggleModule(modul)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Vis varsler til brukere</h2>
          <Textarea value={adminMessage} onChange={(e) => setAdminMessage(e.target.value)} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Vipps-konfigurasjon</h2>
            <Label htmlFor="vipps">API-nøkkel</Label>
            <Input id="vipps" value={vippsKey} onChange={(e) => setVippsKey(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Altinn-konfigurasjon</h2>
            <Label htmlFor="altinn">API-nøkkel</Label>
            <Input id="altinn" value={altinnKey} onChange={(e) => setAltinnKey(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Endre logo</h2>
            {logoUrl && <img src={logoUrl} alt="Nåværende logo" className="h-16" />}
            <Input type="file" onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Designfarger</h2>
            <Label htmlFor="primaryColor">Primærfarge</Label>
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
            <Label htmlFor="secondaryColor">Sekundærfarge</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="font-semibold">Hurtigtilgang</h2>
          <Link href="/admin/systemstatus"><Button variant="outline">Systemstatus</Button></Link>
          <Link href="/regnskap"><Button variant="outline">Regnskap</Button></Link>
          <Link href="/bruker_dashboard"><Button variant="outline">Gå til Brukervisning</Button></Link>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={handleSave}>Lagre endringer</Button>
      </div>
    </div>
  );
}
