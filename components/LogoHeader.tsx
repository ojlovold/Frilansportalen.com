// components/LogoHeader.tsx – Stor, hvit logo nøyaktig som mockup
import Image from "next/image";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-10">
      <Image
        src="/logo_white.svg"
        alt="Frilansportalen logo"
        width={160}
        height={160}
        className="drop-shadow-2xl"
        priority
      />
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide mt-6 uppercase">
        Velkommen
      </h1>
    </div>
  );
}
