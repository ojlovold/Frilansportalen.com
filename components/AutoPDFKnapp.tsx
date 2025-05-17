import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { brukerHarPremium } from "@/utils/brukerHarPremium";
import PremiumBox from "@/components/PremiumBox";
import { generatePDF } from "@/utils/pdfEksport";

interface AutoPDFKnappProps {
  tittel: string;
  filnavn: string;
  kolonner: string[];
  rader: any[][];
}

export default function AutoPDFKnapp({
  tittel,
  filnavn,
  kolonner,
  rader,
}: AutoPDFKnappProps) {
  const { user } = useUser();
  const [harPremium, setHarPremium] = useState(false);

  useEffect(() => {
    if (!user) return;

    const sjekk = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);
    };

    sjekk();
  }, [user]);

  if (!user) return null;
  if (!harPremium) return <PremiumBox />;

  const handleClick = () => {
    generatePDF({ tittel, filnavn, kolonner, rader });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-4 py-2 rounded text-sm"
    >
      Last ned PDF
    </button>
  );
}
