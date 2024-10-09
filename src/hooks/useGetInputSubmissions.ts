import { useContext, useState } from "react";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserContextProvider";

export const useGetInputSubmissions = () => {
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function getInputSubmissions({
    submissionId,
  }: {
    submissionId: string | null;
  }) {
    try {
      if (!submissionId) {
        setLoading(false);
        throw new Error("Submission ID was not provided");
      }

      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/api/form/get-input-submissions/${submissionId}`,
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
            body.message ||
            `Something went wrong when getting input submissions for submission "${submissionId}"`
          }`
        );
      }

      return await response.json();
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  return { getInputSubmissions, loading, error: localError };
};
