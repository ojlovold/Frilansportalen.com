import { ReactNode } from "react";

// Brukes som tom komponent inntil Oversetter gjenaktiveres
export function AutoOversett({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function AutoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />;
}

export function AutoButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{props.children}</button>;
}

export function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} />;
}
