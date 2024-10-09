import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputTypePropertyType } from "../lib/types";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export const useInputTypeProperties = () => {
  const [inputTypeProperties, setInputTypeProperties] = useState<{
    [key: string]: InputTypePropertyType[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function getInputTypeProperties(): Promise<void> {
    setLoading(true);
    setLocalError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/form/get-default-input-properties",
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
            body.message || "An error occured while fetching form item type properties"
          }`
        );
      }

      const data = await response.json();

      setInputTypeProperties(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInputTypeProperties();
  }, []);

  useEffect(() => {
    console.log(inputTypeProperties);
  }, [inputTypeProperties]);

  return { inputTypeProperties, setInputTypeProperties, loading, localError };
};
