import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { brukerHarPremium } from "@/utils/brukerHarPremium";
import PremiumBox from "@/components/PremiumBox";

export default function VideoChat() {
  const { user } = useUser();
  const [harPremium, setHarPremium] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");

  useEffect(() => {
    if (!user) return;

    const start = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);

      // Her simuleres en romlenke, men kan kobles mot Supabase om ønskelig
      const romId = user.id.substring(0, 6);
      setRoomUrl(`https://meet.jit.si/frilansportalen-${romId}`);
    };

    start();
  }, [user]);

  if (!user) return <div className="p-8">Laster videosamtale...</div>;
  if (!harPremium) return <PremiumBox />;

  return (
    <div className="p-8 bg-portalGul text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Videosamtale</h1>

      <p className="mb-4">Din personlige romlenke:</p>
      <a
        href={roomUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Start videosamtale
      </a>

      <iframe
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture"
        style={{ width: "100%", height: "600px", marginTop: "2rem", borderRadius: "1rem" }}
        title="Videochat"
      ></iframe>
    </div>
  );
}
