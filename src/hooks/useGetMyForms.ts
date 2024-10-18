import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllFormsType } from "../lib/types";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export const useGetMyForms = () => {
  const [forms, setForms] = useState<AllFormsType[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOptionType>({
    id: 3,
    name: "Date: New-Old",
    value: "date-new-old",
  });
  const [loading, setLoading] = useState<boolean>(true);
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

        const data = await response.json();

        setForms(data);
      } catch (error) {
        handleCatchError(error, setError, setLocalError);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getMyForms({sort: selectedSort.value});
  }, [selectedSort.value]);

  return { forms, setSelectedSort, loading, error: localError };
};
