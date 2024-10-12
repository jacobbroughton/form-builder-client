import { useCallback, useContext, useState } from "react";
import { InputType, InputTypePropertyType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useAddNewInputToPublishedForm = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const addNewInputToPublishedForm = useCallback(
    async (body: {
      inputTypeId: number | undefined;
      inputMetadataQuestion: string;
      inputMetadataDescription: string;
      properties: InputTypePropertyType[];
      formId: string | undefined;
      isRequired: boolean;
    }): Promise<InputType> => {
      setLoading(true);
      setLocalError(null);

      try {
        if (!body.inputTypeId) throw new Error("Input type id not provided");
        if (!body.formId) throw new Error("Form ID for new input type was not provided");

        const response = await fetch("http://localhost:3001/api/form/add-new-input-to-published-form", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            inputTypeId: body.inputTypeId,
            inputMetadataQuestion: body.inputMetadataQuestion,
            inputMetadataDescription: body.inputMetadataDescription,
            formId: body.formId,
            isRequired: body.isRequired,
            properties: body.properties
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
            `Error: ${
              body.message ||
              "Something happened when trying to add a new form item to the published form"
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

  return { addNewInputToPublishedForm, loading, localError };
};
