import { useCallback, useContext, useState } from "react";
import { InputTypePropertyOptionType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const useGetInputTypePropertyOptions = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const getInputTypePropertyOptions = useCallback(async (): Promise<{
    [key: string]: InputTypePropertyOptionType[];
  }> => {
    setLoading(true);
    setLocalError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/form/get-default-input-property-options",
        { credentials: "include" }
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(
          `Error: ${
            body.message ||
            "An error occured while fetching form item type property options"
          }`
        );
      }

      return await response.json();
    } catch (error) {
      handleCatchError(error, setError, setLocalError);;
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getInputTypePropertyOptions, loading, localError };
};
