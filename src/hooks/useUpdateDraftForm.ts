import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DraftFormType } from "../lib/types";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export const useUpdateDraftForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const updateDraftForm = useCallback(
    async (body: {
      formId: string;
      title: string;
      description: string;
      privacyId: number;
      privacyPasskey: string;
      canResubmit: boolean;
    }): Promise<DraftFormType> => {
      setLoading(true);
      setLocalError(null);

      try {
        if (!body.formId) throw new Error("Form ID was not provided");

        const response = await fetch("http://localhost:3001/api/form/update-draft-form", {
          method: "put",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            formId: body.formId,
            title: body.title,
            description: body.description,
            privacyId: body.privacyId,
            privacyPasskey: body.privacyPasskey,
            canResubmit: body.canResubmit
          }),
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status == 401) {
            setUser(null);
            navigate("/login");
          }

          const body = await response.json();
          throw new Error(
            `Error: ${body.message || "An error occured while updating the form draft"}`
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

  return { updateDraftForm, loading, localError };
};
