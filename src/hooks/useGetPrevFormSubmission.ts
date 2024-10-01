import { useContext, useState } from "react";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";

export const useGetPrevFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const getPrevFormSubmissions = async ({ formId }: { formId: string }) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/form/get-prev-form-submissions/${formId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("There was a problem looking for previous form submissions");

      const data = response.json();

      return data;
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { getPrevFormSubmissions, loading, error: localError };
};
