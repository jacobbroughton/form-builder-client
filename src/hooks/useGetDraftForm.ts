import { useCallback, useContext, useState } from "react";
import { DraftFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useGetDraftForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getDraftForm = useCallback(
    async (params: { formId: string | undefined }): Promise<DraftFormType> => {
      setLoading(true);
      setLocalError(null);

      try {
        if (!params.formId)
          throw new Error("No form ID provided for fetching draft form");

        const response = await fetch(
          `http://localhost:3001/api/form/get-draft-form/${params.formId}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          if (response.status == 401) {
            setUser(null);
            navigate("/login");
          }

          const body = await response.json();
          throw new Error(
            `Error: ${
              body.message || "There was a problem fetching the draft form as user"
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
    },
    []
  );

  return { getDraftForm, loading, localError };
};
