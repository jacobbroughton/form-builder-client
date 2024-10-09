import { useCallback, useContext, useEffect, useState } from "react";
import { InputTypePropertyOptionType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useInputTypePropertyOptions = () => {
  const [inputTypePropertyOptions, setInputTypePropertyOptions] = useState<{
    [key: string]: InputTypePropertyOptionType[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function getInputTypePropertyOptions(): Promise<void> {
    setLoading(true);
    setLocalError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/form/get-default-input-property-options",
        { credentials: "include" }
      );

      if (!response.ok) {
        if (response.status == 401) {
          setUser(null);
          navigate("/login");
        }

        const body = await response.json();
        throw new Error(
          `Error: ${
            body.message ||
            "An error occured while fetching form item type property options"
          }`
        );
      }

      const data = await response.json();

      setInputTypePropertyOptions(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInputTypePropertyOptions();
  }, []);

  return { inputTypePropertyOptions, setInputTypePropertyOptions, loading, localError };
};
