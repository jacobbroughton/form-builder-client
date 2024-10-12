import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { InputTypeType } from "../lib/types";

export const useGetInputTypes = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [inputTypes, setInputTypes] = useState<InputTypeType[]>([]);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const getInputTypes = async () => {
    setLoading(true);
    setLocalError(null);

    try {
      const response = await fetch("http://localhost:3001/api/form/get-default-input-types", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status == 401) {
          setUser(null);
          navigate("/login");
        }

        const body = await response.json();
        throw new Error(
          `Error: ${body.message || "An error occured while fetching form types"}`
        );
      }

      const data = await response.json();

      setInputTypes(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInputTypes();
  }, []);

  return { inputTypes, loading, localError };
};
