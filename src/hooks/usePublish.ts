import { useCallback, useContext, useState } from "react";
import { PublishedFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const usePublish = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const publish = useCallback(
    async (body: { draftFormId: string }): Promise<PublishedFormType[]> => {
      setLoading(true);
      setLocalError(null);

      try {
        const response = await fetch("http://localhost:3001/form/publish", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            draftFormId: body.draftFormId,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          const body = await response.json();
          throw new Error(
            `Error: ${body.message || "Something went wrong when publishing this form"}`
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

  return { publish, loading, localError };
};
