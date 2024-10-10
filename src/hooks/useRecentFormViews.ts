import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export function useRecentFormViews() {
  const [recentFormViews, setRecentFormViews] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

  async function getRecentFormViews() {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/form/get-recent-form-views`,
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
          `Error: ${body.message || "Something went wrong when publishing this form"}`
        );
      }

      const data = await response.json();

      setRecentFormViews(data);
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRecentFormViews();
  }, []);

  return { recentFormViews, loading, error: localError };
}
