import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import TilbakeKnapp from "@/components/TilbakeKnapp";
import Link from "next/link";

const getFlagg = (lang: string) => {
  const landkode = lang.split("-")[1]?.toLowerCase() || lang.slice(-2).toLowerCase();
  return String.fromCodePoint(...[...landkode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
};

const unikeSpråk = () => {
  const sett = new Set<string>();
  return typeof window !== "undefined"
    ? window.speechSynthesis.getVoices()
        .filter((v) => {
          if (sett.has(v.lang)) return false;
          sett.add(v.lang);
          return true;
        })
        .map((v) => ({
          kode: v.lang,
          navn: `${getFlagg(v.lang)} ${v.lang}`
        }))
        .sort((a, b) => a.navn.localeCompare(b.navn))
    : [];
};

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visSprak, setVisSprak] = useState(false);
  const [visTale, setVisTale] = useState(false);
  const [sprak, setSprak] = useState("no");
  const [leser, setLeser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lagret = localStorage.getItem("sprak");
      if (lagret) setSprak(lagret);
    }
  }, []);

  const byttSprak = (kode: string) => {
    localStorage.setItem("sprak", kode);
    setSprak(kode);
    router.push(router.pathname, router.asPath, { locale: kode });
    setVisSprak(false);
  };

  const språkTilLangkode = (kode: string) => {
    switch (kode) {
      case "en": return "en-US";
      case "sv": return "sv-SE";
      case "da": return "da-DK";
      case "de": return "de-DE";
      case "fr": return "fr-FR";
      default: return "no-NO";
    }
  };

  const lesOpp = () => {
    if (typeof window !== "undefined") {
      const uttale = new SpeechSynthesisUtterance(document.body.innerText);
      uttale.lang = språkTilLangkode(sprak);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(uttale);
      setLeser(true);
      uttale.onend = () => setLeser(false);
    }
  };

  const stoppLesing = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      setLeser(false);
    }
  };

  const visPiler =
    typeof window !== "undefined" &&
    !["/", "/dashboard"].includes(window.location.pathname);

  return (
    <div className="min-h-screen text-black relative bg-gradient-to-b from-[#FF7E05] via-[#FEC83C] to-[#FFF0B8]">
      {/* Øvre ikonrekke */}
      <div className="fixed top-4 right-28 z-50 flex flex-row-reverse items-center gap-6">
        <Link href="/login" className="hover:opacity-80">
          <img
            src="/A_2D_digital_illustration_features_a_raised,_3D-st.png"
            alt="Logg inn"
            className="h-12 max-w-[60px] object-contain"
          />
        </Link>

        <button
          title="Test"
          onClick={() => alert("Klikk fungerer")}
          className="hover:opacity-80 focus:outline-none cursor-pointer"
        >
          <img
            src="/A_2D_digital_image_features_a_three-dimensional_wh.png"
            alt="Test"
            className="h-12 max-w-[60px] object-contain pointer-events-none"
          />
        </button>
      </div>

      <main className="p-4 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
