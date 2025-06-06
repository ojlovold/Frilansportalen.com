import { ReactNode, useEffect, useState } from "react";
import { translateTekst } from "@/lib/translate";

export function AutoOversett({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

interface AutoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  title?: string;
  "aria-label"?: string;
}

export function AutoInput(props: AutoInputProps) {
  const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";
  const [placeholder, setPlaceholder] = useState(props.placeholder);
  const [title, setTitle] = useState(props.title);
  const [ariaLabel, setAriaLabel] = useState(props["aria-label"]);

  useEffect(() => {
    if (props.placeholder) translateTekst(props.placeholder, språk).then(setPlaceholder);
    if (props.title) translateTekst(props.title, språk).then(setTitle);
    if (props["aria-label"]) translateTekst(props["aria-label"], språk).then(setAriaLabel);
  }, [props.placeholder, props.title, props["aria-label"], språk]);

  return (
    <input
      {...props}
      placeholder={placeholder}
      title={title}
      aria-label={ariaLabel}
    />
  );
}

interface AutoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

export function AutoButton({ children, ...rest }: AutoButtonProps) {
  const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";
  const [oversatt, setOversatt] = useState(children);

  useEffect(() => {
    translateTekst(children, språk).then(setOversatt);
  }, [children, språk]);

  return <button {...rest}>{oversatt}</button>;
}

interface AutoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

export function AutoTextarea(props: AutoTextareaProps) {
  const språk = typeof window !== "undefined" ? localStorage.getItem("sprak") || "no" : "no";
  const [placeholder, setPlaceholder] = useState(props.placeholder);

  useEffect(() => {
    if (props.placeholder) translateTekst(props.placeholder, språk).then(setPlaceholder);
  }, [props.placeholder, språk]);

  return <textarea {...props} placeholder={placeholder} />;
}
