import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const [vippsKey, setVippsKey] = useState("");
  const [altinnKey, setAltinnKey] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#FFD700");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("admin_config").select("*").single();
      if (data) {
        setVippsKey(data.vippsApiKey || "");
        setAltinnKey(data.altinnApiKey || "");
        setPrimaryColor(data.primaryColor || "#FFD700");
        setSecondaryColor(data.secondaryColor || "#000000");
        setLogoUrl(data.logoUrl || "");
      }
    };
    fetchConfig();
  }, []);

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
        const { data: urlData } = supabase.storage
          .from("logos")
          .getPublicUrl(data.path);
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

    alert("Endringer lagret");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Adminpanel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Vipps-konfigurasjon</h2>
            <Label htmlFor="vipps">API-nøkkel</Label>
            <Input
              id="vipps"
              value={vippsKey}
              onChange={(e) => setVippsKey(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Altinn-konfigurasjon</h2>
            <Label htmlFor="altinn">API-nøkkel</Label>
            <Input
              id="altinn"
              value={altinnKey}
              onChange={(e) => setAltinnKey(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Endre logo</h2>
            {logoUrl && (
              <img src={logoUrl} alt="Nåværende logo" className="h-16" />
            )}
            <Input
              type="file"
              onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)}
            />
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
      <div className="mt-6">
        <Button onClick={handleSave}>Lagre endringer</Button>
      </div>
    </div>
  );
}
