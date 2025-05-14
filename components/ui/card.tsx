import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-black bg-white shadow">{children}</div>
  );
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div className="p-4">{children}</div>;
}
