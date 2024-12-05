import { useContext, useEffect, useState } from "react";
import { ErrorContext } from "../providers/ErrorContextProvider";
import { handleCatchError } from "../utils/usefulFunctions";
import { useGetExistingEmptyDraft } from "./useGetExistingEmptyDraft";
import { useRenewExistingDraft } from "./useRenewExistingDraft";
import { useStoreInitialDraft } from "./useStoreInitialDraft";

export function useNewDraft() {
  const [newDraft, setNewDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { setError } = useContext(ErrorContext);

  const { storeInitialDraft } = useStoreInitialDraft();
  const { getExistingEmptyDraft } = useGetExistingEmptyDraft();
  const { renewExistingDraft } = useRenewExistingDraft();

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
