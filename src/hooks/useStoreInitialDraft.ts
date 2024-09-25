import { useCallback, useContext, useState } from "react";
import { DraftFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const useStoreInitialDraft = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const storeInitialDraft = useCallback(async (): Promise<DraftFormType> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/form/store-initial-draft", {
        method: "post",

        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(
          `Error: ${body.message || "An error occured while storing initial form draft"}`
        );
      }

      return await response.json();
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { storeInitialDraft, loading, localError };
};
