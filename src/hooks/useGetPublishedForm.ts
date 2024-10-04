import { useCallback, useContext, useEffect, useState } from "react";
import { PublishedFormType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate, useParams } from "react-router-dom";

export const useGetPublishedForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [needsPasskeyValidation, setNeedsPasskeyValidation] = useState(false);
  const [form, setForm] = useState(null);
  const [inputs, setInputs] = useState([]);
  const { formId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // const getPublishedForm = useCallback(
  //   async (params: { formId: string | undefined }): Promise<PublishedFormType> => {
  //     setLoading(true);
  //     setLocalError(null);

  //     try {
  //       if (!params.formId)
  //         throw new Error("No form ID provided for fetching published form");

  //       const response = await fetch(
  //         `http://localhost:3001/api/form/get-published-form/${params.formId}`,
  //         { credentials: "include" }
  //       );

  //       if (!response.ok) {
  //         if (response.status == 401) {
  //           setUser(null);
  //           navigate("/login");
  //         }

  //         if (response.status == 403) {
  //           setNeedsPasskeyValidation(true);
  //         }

  //         const body = await response.json();
  //         throw new Error(`Error: ${body.message || "There was an error fetching form"}`);
  //       }

  //       const data = await response.json();

  //       setForm(data.form);
  //       setInputs(
  //         data.inputs.map((input) => ({
  //           ...input,
  //           value: input.existing_answer || "",
  //         }))
  //       );

  //       return await response.json();
  //     } catch (error) {
  //       handleCatchError(error, setError, setLocalError);
  //       throw error;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   []
  // );

  const getPublishedForm = async (params: {
    formId: string | undefined;
  }): Promise<PublishedFormType> => {
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

      const data = await response.json();

      setForm(data.form);
      setInputs(
        data.inputs.map((input) => ({
          ...input,
          value: input.existing_answer || "",
        }))
      );

      // return await response.json();
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

  // return { getPublishedForm, needsPasskeyValidation, loading, localError };
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
