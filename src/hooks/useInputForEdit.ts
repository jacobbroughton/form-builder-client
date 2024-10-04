import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { handleCatchError } from "../utils/usefulFunctions";

export const useInputForEdit = () => {
  const [loading, setLoading] = useState(false);
  const [initialInput, setInitialInput] = useState(null);
  const [updatedInput, setUpdatedInput] = useState(null);
  const [localError, setLocalError] = useState<string | null>(null);

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

      setInitialInput(data);
      setUpdatedInput(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInput({ inputId });
  }, []);

  return { initialInput, updatedInput, setUpdatedInput, loading, error: localError };
};
