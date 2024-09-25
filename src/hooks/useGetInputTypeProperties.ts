import { useCallback, useContext, useState } from "react";
import { InputTypePropertyType } from "../lib/types";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useGetInputTypeProperties = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getInputTypeProperties = useCallback(async (): Promise<{
    [key: string]: InputTypePropertyType[];
  }> => {
    setLoading(true);
    setLocalError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/form/get-default-input-properties",
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

      return await response.json();
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getInputTypeProperties, loading, localError };
};
