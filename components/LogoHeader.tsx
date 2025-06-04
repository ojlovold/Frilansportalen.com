// components/LogoHeader.tsx – Eksakt mockup-plassering og størrelse
import Image from "next/image";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-16 pb-10">
      <Image
        src="/logo_transparent.png"
        alt="Frilansportalen logo"
        width={96}
        height={96}
        className="drop-shadow-xl mb-4"
        priority
      />
      <h1 className="text-4xl font-extrabold text-white drop-shadow-xl tracking-wide uppercase">
        Velkommen
      </h1>
    </div>
  );
}
