import { useCallback, useContext, useState } from "react";
import { AllFormsType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserContextProvider";

export const useGetMyForms = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getMyForms = useCallback(
    async (params: { sort: string }): Promise<AllFormsType[]> => {
      setLoading(true);
      setLocalError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/form/get-my-forms/${params.sort}`,
          {
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
            `Error: ${body.message || "There was a problem fetching forms"}`
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

  return { getMyForms, loading, localError };
};
