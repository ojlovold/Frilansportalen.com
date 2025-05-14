import { ReactNode, HTMLAttributes } from "react";

type CardProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-xl border border-black bg-white shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
