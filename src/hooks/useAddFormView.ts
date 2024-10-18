import { useContext, useState } from "react";
import { UserContext } from "../providers/UserContextProvider";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import { handleCatchError } from "../utils/usefulFunctions";

export function useAddFormView() {
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);
  const { formId } = useParams();
  const navigate = useNavigate();

  async function addFormView() {
    try {
      setLoading(true);
      if (!formId) throw new Error("Form id not provided, not adding form view");

      const response = await fetch(`http://localhost:3001/api/form/add-form-view`, {
        credentials: "include",
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          formId,
        }),
      });

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
    } catch (error) {
      handleCatchError(error, setError, setLocalError);
    } finally {
      setLoading(false);
    }
  }

  return { addFormView, loading, error: localError };
}
