import { useCallback, useContext, useState } from "react";
import { PublishedFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const useGetPublishedForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const getPublishedForm = useCallback(
    async (params: { formId: string | undefined }): Promise<PublishedFormType> => {
      setLoading(true);
      setLocalError(null);

      try {
        if (!params.formId)
          throw new Error("No form ID provided for fetching published form");

        const response = await fetch(
          `http://localhost:3001/form/get-published-form/${params.formId}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          const body = await response.json();
          throw new Error(`Error: ${body.message || "There was an error fetching form"}`);
        }

        return await response.json();
      } catch (error) {
        handleCatchError(error, setError, setLocalError);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getPublishedForm, loading, localError };
};
