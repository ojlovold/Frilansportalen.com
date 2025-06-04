// components/RolleKort.tsx – med bindestrek og to-linjers støtte
import Link from "next/link";
import Image from "next/image";

export default function RolleKort({ href, label, icon }: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link href={href} legacyBehavior>
      <a className="relative bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] px-6 py-4 rounded-[22px] flex flex-col items-center justify-center text-base font-medium text-white shadow-[6px_8px_18px_rgba(0,0,0,0.4)] border border-white/20 hover:scale-[1.02] transition gap-2 text-center">
        <Image
          src={icon}
          alt={label}
          width={48}
          height={48}
          className="drop-shadow-lg object-contain"
        />
        <span className="leading-tight break-words hyphens-auto max-w-[120px]">
          {label}
        </span>
      </a>
    </Link>
  );
}
