import { useEffect, useState } from "react";
import { AddedInputType, DraftFormType, InputTypeType } from "../../../lib/types";
import {
  getDraftForms,
  storeInitialDraft,
  updateForm,
} from "../../../utils/fetchRequests";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { ExistingOrNewDraftSelector } from "../../ui/ExistingOrNewDraftSelector/ExistingOrNewDraftSelector";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { StagedItemForm } from "../../ui/StagedItemForm/StagedItemForm";
import "./CreateForm.css";

export const CreateForm = () => {
  const [draft, setDraft] = useState<{
    form: DraftFormType | null;
    inputs: AddedInputType[];
  }>({
    form: null,
    inputs: [],
  });

  const [prevSavedForm, setPrevSavedForm] = useState<{
    form: DraftFormType | null;
    inputs: AddedInputType[];
  }>({
    form: null,
    inputs: [],
  });

  const [draftIdToFetch, setDraftIdToFetch] = useState<string | null>(null);

  const [initiallyLoading, setInitiallyLoading] = useState(false);
  const [currentView, setCurrentView] = useState("existing-or-new-draft");
  const [saved, setSaved] = useState(true);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(2);
  const [needsAutoSave, setNeedsAutoSave] = useState(false);

  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );

  const [draftForms, setDraftForms] = useState<DraftFormType[]>([]);

  let isStoring = false;

  async function createNewDraft(): Promise<void> {
    try {
      if (isStoring) return;
      isStoring = true;

      const data = await storeInitialDraft({
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
      });

      console.log("Stored initial draft", data);

      setPrevSavedForm({
        form: data,
        inputs: [],
      });

      setDraft({
        form: data,
        inputs: [],
      });
    } catch (error) {
      handleCatchError(error);
    }
  }

  async function saveDraft() {
    try {
      console.log('Trying to update form', draft)
      const data = await updateForm({
        formId: draft.form!.id,
        title: draft.form!.title,
        description: draft.form!.description,
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
        isForDraft: true,
      });

      setDraft({
        inputs: draft?.inputs,
        form: data,
      });
    } catch (error) {
      handleCatchError(error);
    }
  }

  useEffect(() => {
    console.log("form changed", draft);
  }, [draft.form?.id]);

  async function getDraftFormsLocal() {
    try {
      setInitiallyLoading(true);

      const data = await getDraftForms({
        userId: "75c75c02-b39b-4f33-b940-49aa20b9eda4",
      });

      console.log("Get draft forms");

      setDraftForms(data);

      if (!data.length) {
        createNewDraft();
        setCurrentView("metadata-inputs");
      }

      setInitiallyLoading(false);
    } catch (error) {
      handleCatchError(error);
    }
  }

  function renderView() {
    switch (currentView) {
      case "existing-or-new-draft": {
        return (
          <ExistingOrNewDraftSelector
            draftForms={draftForms}
            // setPrevSavedForm={setPrevSavedForm}
            // setDraft={setDraft}
            setDraftIdToFetch={setDraftIdToFetch}
            setCurrentView={setCurrentView}
            createNewDraft={createNewDraft}
          />
        );
      }
      case "metadata-inputs": {
        return (
          <>
            <p className="saved-status">
              <span className={`${saved ? "saved" : ""}`}></span>
              {saved ? "Saved Draft" : "Unsaved"}{" "}
              {!saved ? `(Autosaving in ${autoSaveCountdown}s)` : false}
            </p>
            <MetadataInputs
              form={draft}
              setForm={setDraft}
              setCurrentView={setCurrentView}
              setPrevSavedForm={setPrevSavedForm}
              isForDraft={true}
              draftIdToFetch={draftIdToFetch}
            />
          </>
        );
      }
      case "input-types-selector": {
        return (
          <InputTypeSelector
            setCurrentView={setCurrentView}
            setStagedNewInputType={setStagedNewInputType}
          />
        );
      }
      case "staged-item-form": {
        return (
          <StagedItemForm
            form={draft}
            setForm={setDraft}
            setCurrentView={setCurrentView}
            stagedNewInputType={stagedNewInputType}
            setStagedNewInputType={setStagedNewInputType}
            isForDraft={true}
          />
        );
      }
      default: {
        return (
          <p>Hmm...not sure where you were trying to go, but it probably isn't here</p>
        );
      }
    }
  }

  useEffect(() => {
    getDraftFormsLocal();
  }, []);

  useEffect(() => {
    async function autoSaveDraft(): Promise<void> {
      try {
        setPrevSavedForm({
          form: draft.form,
          inputs: draft.inputs,
        });

        saveDraft();

        setSaved(true);
        setNeedsAutoSave(false);
        setAutoSaveCountdown(2);
      } catch (error) {
        handleCatchError(error);
      }
    }

    const interval1 = setInterval(() => {
      if (needsAutoSave && draft.form) {
        autoSaveDraft();
      }
    }, autoSaveCountdown * 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [
    needsAutoSave,
    draft.form?.description,
    draft.form?.title,
    draft.form,
    draft.inputs,
    saveDraft,
  ]);

  useEffect(() => {
    const interval2 = setInterval(() => {
      if (!saved) {
        console.log("Not saved");
        setAutoSaveCountdown((prev) => (prev -= 1));
      }
    }, 1000);
    return () => {
      clearInterval(interval2);
    };
  }, [saved]);

  useEffect(() => {
    if (
      draft.form &&
      prevSavedForm.form &&
      (draft.form.title !== prevSavedForm.form.title ||
        draft.form.description !== prevSavedForm.form.description)
    ) {
      setSaved(false);
      setNeedsAutoSave(true);
    }
  }, [
    draft.form?.description,
    draft.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
  ]);

  return (
    <main className="create-form">
      {initiallyLoading ? <p>Loading...</p> : renderView()}
    </main>
  );
};
