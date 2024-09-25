import { useCallback, useContext, useState } from "react";
import { DraftFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useDeleteDraftForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const deleteDraftForm = useCallback(
    async (params: { formId: string | undefined }): Promise<DraftFormType> => {
      setLoading(true);
      setLocalError(null);

      try {
        if (!params.formId)
          throw new Error("No form ID was provided for deleting the draft form");

        const response = await fetch(
          `http://localhost:3001/form/delete-draft-form/${params.formId}`,
          {
            method: "put",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status == 401) {
            setUser(null);
            navigate("/login");
          }

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

  return { deleteDraftForm, loading, localError };
};
