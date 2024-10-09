import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivacyOptionResponseType, PrivacyOptionType } from "../lib/types";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";

export const useGetPrivacyOptions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [privacyOptions, setPrivacyOptions] = useState<PrivacyOptionType[]>([]);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function getPrivacyOptions(formPrivacyId: number) {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/form/get-privacy-options", {
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
        data.map((option) => ({
          ...option,
          checked: formPrivacyId ? formPrivacyId === option.id : option.id === 1,
        }))
      );
    } catch (error: unknown) {
      handleCatchError(error, setError, setLocalError);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    getPrivacyOptions,
    privacyOptions,
    setPrivacyOptions,
    loading,
    error: localError,
  };
};
