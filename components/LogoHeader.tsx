// components/LogoHeader.tsx – maks skygge på alt
import DynamicLogo from "@/components/DynamicLogo";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-0 pb-8">
      <DynamicLogo className="w-auto h-64 mb-4 drop-shadow-2xl" />
      <h1 className="text-xl font-medium text-white drop-shadow-2xl tracking-normal">
        Bli med og bygg en ny arbeidsverden.
      </h1>
    </div>
  );
}
