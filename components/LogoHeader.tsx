// components/LogoHeader.tsx – med dempet, skyggelagt slagord
import DynamicLogo from "@/components/DynamicLogo";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-4 pb-8">
      <DynamicLogo className="w-auto h-64 drop-shadow-2xl mb-6" />
      <h1 className="text-xl font-medium text-white drop-shadow-xl tracking-normal">
        Bli med og bygg en ny arbeidsverden.
      </h1>
    </div>
  );
}
