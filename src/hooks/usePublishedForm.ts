import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputTypeWithProperties, PublishedFormType } from "../lib/types";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export const usePublishedForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [needsPasskeyValidation, setNeedsPasskeyValidation] = useState(false);
  const [form, setForm] = useState<PublishedFormType | null>(null);
  const [inputs, setInputs] = useState<InputTypeWithProperties[]>([]);
  const { formId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getPublishedForm = async (params: {
    formId: string | undefined;
  }): Promise<void> => {
    setLoading(true);
    setLocalError(null);

    try {
      if (!params.formId)
        throw new Error("No form ID provided for fetching published form");

      const response = await fetch(
        `http://localhost:3001/api/form/get-published-form/${params.formId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        if (response.status == 401) {
          setUser(null);
          navigate("/login");
        }

        if (response.status == 403) {
          setNeedsPasskeyValidation(true);
        }

        const body = await response.json();
        throw new Error(`Error: ${body.message || "There was an error fetching form"}`);
      }

      const data: {
        form: PublishedFormType | null;
        requiresPasscode: boolean;
        inputs: InputTypeWithProperties[];
      } = await response.json();

      if (data.requiresPasscode) {
        setNeedsPasskeyValidation(true);
        return;
      }

      setForm(data.form);
      setInputs(
        data.inputs.map((input) => ({
          ...input,
          value: input.existing_answer || "",
        }))
      );
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPublishedForm({ formId });
  }, [needsPasskeyValidation]);

  return {
    form,
    inputs,
    needsPasskeyValidation,
    setNeedsPasskeyValidation,
    loading,
    localError,
    setInputs,
  };
};
