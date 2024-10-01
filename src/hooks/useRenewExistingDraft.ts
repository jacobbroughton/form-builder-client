import { useContext, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserContextProvider";

export const useRenewExistingDraft = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const renewExistingDraft = async ({ draftFormId }: { draftFormId: string }) => {
    try {
      if (!draftFormId)
        throw new Error("Draft form ID to renew was not provided or found");

      const response = await fetch("http://localhost:3001/api/form/renew-existing-empty-draft", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          draftFormId,
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
  };

  return { renewExistingDraft, loading, error: localError };
};
