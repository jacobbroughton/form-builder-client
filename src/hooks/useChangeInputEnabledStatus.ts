import { useCallback, useContext, useState } from "react";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useChangeInputEnabledStatus = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const changeInputEnabledStatus = useCallback(
    async (
      params: { inputId: string },
      body: { newActiveStatus: boolean; isDraft: boolean }
    ): Promise<void> => {
      setLoading(true);
      setLocalError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/form/change-input-enabled-status/${params.inputId}`,
          {
            method: "put",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              newActiveStatus: body.newActiveStatus,
              isDraft: body.isDraft,
            }),
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
              body.message || "There was an error deleting this input from the draft form"
            }`
          );
        }

        await response.json();
      } catch (error) {
        handleCatchError(error, setError, setLocalError);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { changeInputEnabledStatus, loading, localError };
};
