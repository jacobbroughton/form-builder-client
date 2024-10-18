import { createContext, ReactElement, useState } from "react";
import { useParams } from "react-router-dom";

interface CurrentViewContext {
  currentView: string | null;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

export const CurrentViewContext = createContext<CurrentViewContext>(
  {} as CurrentViewContext
);

export function CurrentViewContextProvider({ children }: { children: ReactElement }) {
  const { initialView } = useParams();

  const [currentView, setCurrentView] = useState<string>(
    initialView || "metadata-inputs"
  );

  return (
    <CurrentViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </CurrentViewContext.Provider>
  );
}
