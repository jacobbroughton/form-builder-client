import { useContext, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";

export const useGetExistingEmptyDraft = () => {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const getExistingEmptyDraft = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/form/get-existing-empty-draft",
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
          `Error: ${
            body.message || "Something went wrong when getting an existing empty draft"
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
  };

  return { getExistingEmptyDraft, loading, error: localError };
};
