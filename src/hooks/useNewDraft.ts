import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { UserContext } from "../providers/UserContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { useStoreInitialDraft } from "./useStoreInitialDraft";
import { useGetExistingEmptyDraft } from "./useGetExistingEmptyDraft";
import { useRenewExistingDraft } from "./useRenewExistingDraft";

export function useNewDraft() {
  const [newDraft, setNewDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);
  const { setUser } = useContext(UserContext);

  const { storeInitialDraft } = useStoreInitialDraft();
  const { getExistingEmptyDraft } = useGetExistingEmptyDraft();
  const { renewExistingDraft } = useRenewExistingDraft();

  const navigate = useNavigate();

  let isStoring = false;

  async function createNewDraft(): Promise<void> {
    setLoading(true);

    try {
      if (isStoring) return;
      isStoring = true;

      const storedFormData = await getExistingEmptyDraft();

      let formToUse = storedFormData[0];

      if (storedFormData[0]) {
        const data = await renewExistingDraft({ draftFormId: storedFormData[0].id });
        if (data[0]) formToUse = data[0];
      } else {
        const data = await storeInitialDraft();

        if (data) formToUse = data;
      }

      setNewDraft(formToUse);
    } catch (error) {
      handleCatchError(error, setError, null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    createNewDraft();
  }, []);

  return { newDraft, loading, error: localError };
}
