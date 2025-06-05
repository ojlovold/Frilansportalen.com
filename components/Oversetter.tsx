// components/Oversetter.tsx
import { ReactNode, useEffect, useState } from "react";
import { translateTekst } from "@/lib/translate";

export function AutoOversett({ children }: { children: ReactNode }) {
  const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";
  const [oversatt, setOversatt] = useState<ReactNode>(children);

  useEffect(() => {
    const oversettBarn = async () => {
      if (typeof children === "string") {
        const tekst = await translateTekst(children, språk);
        setOversatt(tekst);
      }
    };
    oversettBarn();
  }, [children, språk]);

  return <>{oversatt}</>;
}

interface AutoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export function AutoInput(props: AutoInputProps) {
  const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";
  const [oversatt, setOversatt] = useState(props.placeholder);

  useEffect(() => {
    translateTekst(props.placeholder, språk).then(setOversatt);
  }, [props.placeholder, språk]);

  return <input {...props} placeholder={oversatt} />;
}
