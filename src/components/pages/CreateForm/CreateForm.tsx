import { useContext, useEffect, useState } from "react";
import { AddedInputType, DraftFormType, InputTypeType } from "../../../lib/types";

import { handleCatchError } from "../../../utils/usefulFunctions";
import { ExistingOrNewDraftSelector } from "../../ui/ExistingOrNewDraftSelector/ExistingOrNewDraftSelector";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./CreateForm.css";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { ShareIcon } from "../../ui/icons/ShareIcon";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { useGetDraftForms } from "../../../hooks/useGetDraftForms";
import { usePublish } from "../../../hooks/usePublish";
import { useStoreInitialDraft } from "../../../hooks/useStoreInitialDraft";
import { useUpdateDraftForm } from "../../../hooks/useUpdateDraftForm";

export const CreateForm = () => {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { getDraftForms } = useGetDraftForms();
  const { publish } = usePublish();
  const { storeInitialDraft } = useStoreInitialDraft();
  const { updateDraftForm } = useUpdateDraftForm();

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

      const data = await storeInitialDraft();

      setPrevSavedForm({
        form: data,
        inputs: [],
      });

      setDraft({
        form: data,
        inputs: [],
      });
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  useEffect(() => {
    async function fetchFormToModify() {
      const data = await getDraftForm({ formId: draftIdToFetch! });

      setPrevSavedForm({
        form: data.form,
        inputs: data.inputs,
      });

      setDraft({
        form: data.form,
        inputs: data.inputs,
      });
    }

    if (draftIdToFetch) fetchFormToModify();
  }, [draftIdToFetch]);

  async function saveDraft() {
    try {
      const data = await updateDraftForm({
        formId: draft.form!.id,
        title: draft.form!.title,
        description: draft.form!.description,
      });

      setDraft({
        inputs: draft?.inputs,
        form: data,
      });
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function getDraftFormsLocal() {
    try {
      setInitiallyLoading(true);

      const data = await getDraftForms();

      setDraftForms(data);

      if (!data.length) {
        createNewDraft();
        setCurrentView("metadata-inputs");
      }

      setInitiallyLoading(false);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  function renderView() {
    switch (currentView) {
      case "existing-or-new-draft": {
        return (
          <ExistingOrNewDraftSelector
            draftForms={draftForms}
            setDraftIdToFetch={setDraftIdToFetch}
            setCurrentView={setCurrentView}
            createNewDraft={createNewDraft}
          />
        );
      }
      case "metadata-inputs": {
        return (
          <>
            <SavedStatus saved={saved} autoSaveCountdown={autoSaveCountdown} />
            <MetadataInputs
              form={draft}
              setForm={setDraft}
              setCurrentView={setCurrentView}
              setPrevSavedForm={setPrevSavedForm}
              isForDraft={true}
              draftIdToFetch={draftIdToFetch}
            />
            <button
              className="action-button-with-icon red"
              onClick={() => handleFormDelete()}
            >
              <TrashIcon /> Delete Draft
            </button>

            <button
              className="action-button-with-icon"
              disabled={saved}
              onClick={() => saveDraft()}
            >
              <SaveIcon /> Save Draft
            </button>

            <button
              className="action-button-with-icon green"
              onClick={() => handlePublishForm()}
            >
              <ShareIcon /> Publish Form
            </button>
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
          <StagedInputForm
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

  async function handlePublishForm() {
    try {
      const data = await publish({
        draftFormId: draft.form!.id,
      });

      navigate(`/form/${data[0].id}`);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleFormDelete() {
    try {
      if (!draft.form!.id) throw new Error("No form id provided");

      await deleteDraftForm({ formId: draft.form!.id });

      navigate("/");
    } catch (error) {
      handleCatchError(error, setError, null);
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
        handleCatchError(error, setError, null);
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
        setAutoSaveCountdown((prev) => (prev -= 1));
      }
    }, 1000);
    return () => {
      clearInterval(interval2);
    };
  }, [saved]);

  useEffect(() => {
    if (draft.form && prevSavedForm.form) {
      const condition =
        draft.form.title !== prevSavedForm.form.title ||
        draft.form.description !== prevSavedForm.form.description;
      setSaved(!condition);
      setNeedsAutoSave(condition);
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
