import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { brukerHarPremium } from "@/utils/brukerHarPremium";
import PremiumBox from "@/components/PremiumBox";
import { generatePDF } from "@/utils/pdfEksport";

interface AutoPDFKnappProps {
  data: any;
}

export default function AutoPDFKnapp({ data }: AutoPDFKnappProps) {
  const { user } = useUser();
  const [harPremium, setHarPremium] = useState(false);

  useEffect(() => {
    if (!user) return;

    const sjekkPremium = async () => {
      const har = await brukerHarPremium(user.id);
      setHarPremium(har);
    };

    sjekkPremium();
  }, [user]);

  if (!user) return null;

  if (!harPremium) return <PremiumBox />;

  return (
    <button
      onClick={() => generatePDF(data)}
      className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Last ned som PDF
    </button>
  );
}
