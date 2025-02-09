import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { InputTypeType, InputTypeWithProperties } from "../lib/types";

export const useInputForEdit = () => {
  const [loading, setLoading] = useState(false);
  const [initialInput, setInitialInput] = useState<InputTypeWithProperties | null>(null);
  const [updatedInput, setUpdatedInput] = useState<InputTypeWithProperties | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [inputType, setInputType] = useState<InputTypeType>(null);

  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const { inputId } = useParams();

  async function getInput({ inputId }: { inputId: string }) {
    try {
      if (!inputId) throw new Error("No input id provided");

      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/api/form/get-input/${inputId}`,
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
          `Error: ${body.message || "Something went wrong when getting the input"}`
        );
      }

      const data = await response.json();

      getInputType({ inputTypeId: data.info.input_type_id });

      console.log("get-input", data)

      setInitialInput(data);
      setUpdatedInput(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  async function getInputType({ inputTypeId }: { inputTypeId: string }) {
    try {
      if (!inputTypeId) throw new Error("No input type id provided");

      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/api/form/get-input-type/${inputTypeId}`,
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
          `Error: ${body.message || "Something went wrong when getting the input"}`
        );
      }

      const data = await response.json();

      
      setInputType(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  async function editInput(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/form/edit-input`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updatedInput),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("There was an error updating this input");
      }

      await response.json();

      setInitialInput(updatedInput);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    if (inputId) getInput({ inputId });
  }, [inputId]);

  return {
    inputType,
    initialInput,
    updatedInput,
    setInitialInput,
    setUpdatedInput,
    loading,
    error: localError,
    editInput
  };
};
