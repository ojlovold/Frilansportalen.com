// components/RolleKort.tsx – skygge på hele kortet og ikon
import Link from "next/link";
import Image from "next/image";

export default function RolleKort({ href, label, icon }: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link href={href} legacyBehavior>
      <a className="relative bg-white/10 backdrop-blur-xl px-4 py-6 rounded-3xl flex flex-col items-center justify-center text-sm font-semibold text-white shadow-2xl border border-white/10 hover:scale-[1.03] transition">
        <Image
          src={icon}
          alt={label}
          width={64}
          height={64}
          className="drop-shadow-2xl object-contain mb-3"
        />
        {label}
      </a>
    </Link>
  );
}
