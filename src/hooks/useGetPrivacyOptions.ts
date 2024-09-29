import { useContext, useEffect, useState } from "react";
import { handleCatchError } from "../utils/usefulFunctions";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { useNavigate } from "react-router-dom";
import { PrivacyOptionResponseType, PrivacyOptionType } from "../lib/types";

export const useGetPrivacyOptions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [privacyOptions, setPrivacyOptions] = useState<PrivacyOptionType[]>([]);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function getPrivacyOptions() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/form/get-privacy-options", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status == 401) {
          setUser(null);
          navigate("/login");
        }

        const body = await response.json();
        throw new Error(
          `Error: ${body.message || "An error occured while fetching privacy options"}`
        );
      }

      const data: PrivacyOptionResponseType[] = await response.json();

      setPrivacyOptions(
        data.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === 1,
        }))
      );
    } catch (error: unknown) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPrivacyOptions();
  }, []);

  return { privacyOptions, setPrivacyOptions, loading, error: localError };
};