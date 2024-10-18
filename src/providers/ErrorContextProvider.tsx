import { createContext, ReactElement, useState } from "react";

interface ErrorContext {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ErrorContext = createContext<ErrorContext>({} as ErrorContext);

export function ErrorContextProvider({ children }: { children: ReactElement }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>{children}</ErrorContext.Provider>
  );
}
