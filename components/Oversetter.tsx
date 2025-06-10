// components/Oversetter.tsx – isolasjonstest uten faktisk oversettelse
import { ReactNode } from "react";

export function AutoOversett({ children }: { children: ReactNode }) {
  // Midlertidig: returner kun children for å teste event-propagation
  return <>{children}</>;
}

interface AutoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  title?: string;
  "aria-label"?: string;
}

export function AutoInput(props: AutoInputProps) {
  return <input {...props} />;
}

interface AutoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export function AutoButton({ children, ...rest }: AutoButtonProps) {
  return <button {...rest}>{children}</button>;
}

interface AutoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

export function AutoTextarea(props: AutoTextareaProps) {
  return <textarea {...props} />;
}
