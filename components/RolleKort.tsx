// components/RolleKort.tsx – Mockup-stil kort med individuell farge og glød
import Link from "next/link";

export default function RolleKort({ href, label, icon, color }: {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link href={href} legacyBehavior>
      <a
        className={`flex flex-col items-center justify-center text-sm font-semibold px-4 py-6 rounded-2xl shadow-xl transition-transform hover:scale-[1.03] text-white drop-shadow-md border border-white/10 backdrop-blur-xl bg-[${color}]`}
        style={{ background: `linear-gradient(145deg, ${color}, ${color}dd)` }}
      >
        <div className="mb-2 text-2xl">{icon}</div>
        {label}
      </a>
    </Link>
  );
}
