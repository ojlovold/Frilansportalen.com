import { useUser } from "@supabase/auth-helpers-react";
import generateSimplePDF from "../lib/generateSimplePDF";

interface PDFLastingProps {
  tittel: string;
  innhold: string;
  brukLogo?: boolean;
}

export default function PDFLasting({ tittel, innhold, brukLogo = true }: PDFLastingProps) {
  const { user } = useUser();

  const lastNed = async () => {
    const brukerId = user?.id ?? user?.user_metadata?.id;
    if (!brukerId || typeof brukerId !== "string") return;

    const pdfBlob = await generateSimplePDF(tittel, innhold, brukerId, brukLogo);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tittel}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={lastNed}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Last ned PDF
    </button>
  );
}
