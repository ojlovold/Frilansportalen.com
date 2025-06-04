// components/LogoHeader.tsx – oppdatert tekst med korrekt språk og mockup-stil
import DynamicLogo from "@/components/DynamicLogo";

export default function LogoHeader() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center pt-4 pb-8">
      <DynamicLogo className="w-auto h-64 drop-shadow-2xl mb-4" />
      <h1 className="text-2xl font-semibold text-white drop-shadow-xl tracking-normal mb-2">
        Velkommen til Frilansportalen
      </h1>
      <p className="text-base text-white drop-shadow-xl max-w-lg">
        Sammen forandrer vi hverdagen – for frilansere, arbeidsgivere og tjenestetilbydere over hele landet.
      </p>
    </div>
  );
}
