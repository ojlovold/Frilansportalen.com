// components/RolleKort.tsx – Mockup-presis kortdesign med glød og ikon
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
        <div className="mb-3">
          <Image src={icon} alt="" width={48} height={48} className="drop-shadow-xl" />
        </div>
        {label}
      </a>
    </Link>
  );
}
