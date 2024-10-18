import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export function useResponses () {
  const { formId } = useParams();
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [responses, setResponses] = useState({});
  const { setUser } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

  async function getResponses() {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:3001/api/form/get-responses/${formId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
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
      }

      const data = await response.json();

      setResponses({
        submissionsList: data.submissionsList,
        inputsBySubID: data.inputsBySubID,
      });
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getResponses();
  }, []);

  return { responses, loading, error: localError };
};
