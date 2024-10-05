import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserContextProvider";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { useNavigate, useParams } from "react-router-dom";

export const useResponses = () => {
  const { formId } = useParams();
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [responses, setResponses] = useState([]);
  const { setUser } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

  async function getResponses() {
    try {
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

      setResponses(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getResponses();
  }, []);

  return { responses };
};
