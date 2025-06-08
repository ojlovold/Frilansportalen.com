// context/LayoutContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  visSprak: boolean;
  setVisSprak: (v: boolean) => void;
  visTale: boolean;
  setVisTale: (v: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [visSprak, setVisSprak] = useState(false);
  const [visTale, setVisTale] = useState(false);

  return (
    <LayoutContext.Provider value={{ visSprak, setVisSprak, visTale, setVisTale }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayout must be used inside LayoutProvider");
  return context;
}
