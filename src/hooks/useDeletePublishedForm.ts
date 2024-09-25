import { useCallback, useContext, useState } from "react";
import { PublishedFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const useDeletePublishedForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const deletePublishedForm = useCallback(
    async (params: { formId: string | undefined }): Promise<PublishedFormType> => {
      setLoading(true);
      setLocalError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/form/delete-published-form/${params.formId}`,
          {
            method: "put",
            credentials: "include",
          }
        );

        if (!response.ok) {
          const body = await response.json();
          throw new Error(
            `Error: ${
              body.message || "Something happened while trying to delete this form"
            }`
          );
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

  return { deletePublishedForm, loading, localError };
};
