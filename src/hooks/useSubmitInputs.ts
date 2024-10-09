import { useContext, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { InputType } from "../lib/types";

export const useSubmitForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  async function submitForm({ formId, inputs }: { formId: string; inputs: InputType[] }) {
    try {
      const response = await fetch(`http://localhost:3001/api/form/submit-form`, {
        method: "post",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          formId,
          inputs,
        }),
      });
      if (!response.ok) throw new Error("There was an error submitting inputs");

      return await response.json();
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { submitForm, loading, error: localError };
};
