// components/LogoHeader.tsx – oppjustert logo
import DynamicLogo from "@/components/DynamicLogo";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-10">
      <DynamicLogo className="w-auto h-32 drop-shadow-2xl mb-6" />
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide uppercase">
        Velkommen
      </h1>
    </div>
  );
}
