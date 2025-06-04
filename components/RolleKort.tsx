// components/RolleKort.tsx – mockup-presis layout med glød og ramme
import Link from "next/link";
import Image from "next/image";

export default function RolleKort({ href, label, icon }: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link href={href} legacyBehavior>
      <a className="relative bg-gradient-to-br from-[#1C1C1E] to-[#2A2A2C] px-6 py-4 rounded-[22px] flex items-center justify-start text-base font-medium text-white shadow-[6px_8px_18px_rgba(0,0,0,0.4)] border border-white/20 hover:scale-[1.02] transition gap-4">
        <Image
          src={icon}
          alt={label}
          width={48}
          height={48}
          className="drop-shadow-lg object-contain"
        />
        <span className="whitespace-nowrap">{label}</span>
      </a>
    </Link>
  );
}
