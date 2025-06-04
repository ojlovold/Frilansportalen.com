// components/RolleKort.tsx – forbedret skygge, lys ovenfra til venstre
import Link from "next/link";
import Image from "next/image";

export default function RolleKort({ href, label, icon }: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link href={href} legacyBehavior>
      <a className="relative bg-white/10 backdrop-blur-xl px-4 py-6 rounded-3xl flex flex-col items-center justify-center text-sm font-semibold text-white shadow-[8px_12px_24px_-2px_rgba(0,0,0,0.6)] border border-white/10 hover:scale-[1.03] transition">
        <Image
          src={icon}
          alt={label}
          width={64}
          height={64}
          className="drop-shadow-[4px_6px_12px_rgba(0,0,0,0.7)] object-contain mb-3"
        />
        {label}
      </a>
    </Link>
  );
}
