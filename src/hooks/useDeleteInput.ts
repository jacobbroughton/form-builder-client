import { useContext, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { handleCatchError } from "../utils/usefulFunctions";

export const useDeleteInput = () => {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function deleteInput({ inputId }: { inputId: string }) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/form/delete-published-input/${inputId}`,
        {
          method: "put",
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
            body.message || "Something happened while trying to delete this form"
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
  }

  return { deleteInput, loading, error: localError };
};
