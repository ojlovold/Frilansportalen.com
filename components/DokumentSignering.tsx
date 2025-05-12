import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import generateSimplePDF from "../lib/pdf"; // ← korrekt default-import
import supabase from "../lib/supabaseClient";

type Props = {
  tittel: string;
  innhold: string;
  brukLogo?: boolean;
};

export default function DokumentSignering({ tittel, innhold, brukLogo = true }: Props) {
  const { user } = useUser();
  const [signert, setSignert] = useState(false);

  const signerOgLastOpp = async () => {
    const brukerId = user?.id ?? user?.user_metadata?.id;
    if (!brukerId || typeof brukerId !== "string") return;

    const pdfBlob = await generateSimplePDF(tittel, innhold, brukerId, brukLogo);
    const filnavn = `${tittel.replace(/\s+/g, "_")}_${Date.now()}.pdf`;

    const { error } = await supabase.storage
      .from("signerte-dokumenter")
      .upload(`${brukerId}/${filnavn}`, pdfBlob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      console.error("Feil ved opplasting:", error.message);
    } else {
      setSignert(true);
    }
  };

  return (
    <div>
      <button
        onClick={signerOgLastOpp}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Signer og last opp
      </button>
      {signert && (
        <p className="text-green-700 mt-2">
          Dokumentet er signert og lastet opp til Supabase.
        </p>
      )}
    </div>
  );
}
