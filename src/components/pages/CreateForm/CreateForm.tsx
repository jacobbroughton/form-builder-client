import { useContext, useEffect, useState } from "react";
import {
  AddedInputType,
  DraftFormType,
  InputTypeType,
  PrivacyOptionType,
} from "../../../lib/types";
import { useNavigate } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { useGetExistingEmptyDraft } from "../../../hooks/useGetExistingEmptyDraft";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { usePublish } from "../../../hooks/usePublish";
import { useRenewExistingDraft } from "../../../hooks/useRenewExistingDraft";
import { useStoreInitialDraft } from "../../../hooks/useStoreInitialDraft";
import { useUpdateDraftForm } from "../../../hooks/useUpdateDraftForm";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import ArrowRightIcon from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { ShareIcon } from "../../ui/icons/ShareIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./CreateForm.css";

export const CreateForm = () => {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { publish } = usePublish();
  const { storeInitialDraft } = useStoreInitialDraft();
  const { updateDraftForm } = useUpdateDraftForm();
  const { getExistingEmptyDraft } = useGetExistingEmptyDraft();
  const { renewExistingDraft } = useRenewExistingDraft();
  const {
    getPrivacyOptions,
    privacyOptions,
    setPrivacyOptions,
    loading: privacyOptionsLoading,
    error: privacyOptionsError,
  } = useGetPrivacyOptions();

  const [stagedPrivacyOptions, setStagedPrivacyOptions] = useState<PrivacyOptionType[]>(
    []
  );
  const [privacyPasskey, setPrivacyPasskey] = useState("");
  const [reflectFormPrivacyOption, setReflectFormPrivacyOption] = useState(true);

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
  const [initiallyLoading, setInitiallyLoading] = useState(true);
  const [currentView, setCurrentView] = useState("metadata-inputs");
  const [saved, setSaved] = useState(true);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(2);
  const [needsAutoSave, setNeedsAutoSave] = useState(false);
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [draftForms, setDraftForms] = useState<DraftFormType[]>([]);

  let isStoring = false;

  async function createNewDraft(): Promise<void> {
    setInitiallyLoading(true);

    try {
      if (isStoring) return;
      isStoring = true;

      const storedFormData = await getExistingEmptyDraft();

      let formToUse = storedFormData[0];

      if (storedFormData[0]) {
        const data = await renewExistingDraft({ draftFormId: storedFormData[0].id });
        if (data[0]) formToUse = data[0];

        console.log("1");
      } else {
        const data = await storeInitialDraft();

        if (data) formToUse = data;

        console.log(2);
      }

      console.log({ formToUse });

      setPrevSavedForm({
        form: formToUse,
        inputs: [],
      });

      setDraft({
        form: formToUse,
        inputs: [],
      });
      // setInitiallyLoading(false)
    } catch (error) {
      handleCatchError(error, setError, null);
      // setInitiallyLoading(false)
    } finally {
      setInitiallyLoading(false);
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

  useEffect(() => {
    if (reflectFormPrivacyOption)
      setStagedPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === draft.form?.privacy_id,
        }))
      );
  }, [privacyOptions, draft, reflectFormPrivacyOption]);

  async function saveDraft() {
    try {
      const data = await updateDraftForm({
        formId: draft.form!.id,
        title: draft.form!.title,
        description: draft.form!.description,
        privacyId: stagedPrivacyOptions.find((privacyOption) => privacyOption.checked)!
          .id,
        privacyPasskey,
      });

      setPrevSavedForm({
        inputs: draft?.inputs,
        form: data,
      });

      setDraft({
        inputs: draft?.inputs,
        form: data,
      });
      setSaved(true);
      setAutoSaveCountdown(5);
      setNeedsAutoSave(false);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  // async function getDraftFormsLocal() {
  //   try {
  //     setInitiallyLoading(true);

  //     const data = await getDraftForms();

  //     setDraftForms(data);

  //     if (!data.length) {
  //       createNewDraft();
  //       setCurrentView("metadata-inputs");
  //     }

  //     setInitiallyLoading(false);
  //   } catch (error) {
  //     handleCatchError(error, setError, null);
  //   }
  // }

  const stagedSelectedPrivacyOption = stagedPrivacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

  const selectedPrivacyOption = privacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

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

  function renderView() {
    switch (currentView) {
      // case "existing-or-new-draft": {
      //   return (
      //     <ExistingOrNewDraftSelector
      //       draftForms={draftForms}
      //       setDraftIdToFetch={setDraftIdToFetch}
      //       setCurrentView={setCurrentView}
      //       createNewDraft={createNewDraft}
      //     />
      //   );
      // }
      case "privacy-selector": {
        return (
          <>
            <button
              className="action-button-with-icon"
              onClick={() => {
                if (
                  stagedSelectedPrivacyOption?.needs_passkey &&
                  privacyPasskey !== "" &&
                  !selectedPrivacyOption?.needs_passkey
                )
                  setPrivacyPasskey("");
                setStagedPrivacyOptions(privacyOptions);
                setCurrentView("metadata-inputs");
              }}
            >
              <ArrowLeftIcon /> Back
            </button>
            <PrivacyOptions
              privacyOptions={stagedPrivacyOptions}
              setPrivacyOptions={setStagedPrivacyOptions}
              loading={privacyOptionsLoading}
              error={privacyOptionsError}
              setPrivacyPasskey={setPrivacyPasskey}
              privacyPasskey={privacyPasskey}
            />

            <button
              className="action-button-with-icon"
              disabled={
                stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === ""
              }
              onClick={() => {
                if (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "")
                  return;
                setPrivacyOptions(stagedPrivacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
            >
              Confirm & Continue <ArrowRightIcon />
            </button>
          </>
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
            {selectedPrivacyOption ? (
              <SelectedPrivacyOptionButton
                handleClick={() => setCurrentView("privacy-selector")}
                selectedPrivacyOption={selectedPrivacyOption}
              />
            ) : (
              false
            )}

            <div className="form-buttons">
              <button
                className="action-button-with-icon red"
                onClick={() => handleFormDelete()}
              >
                <TrashIcon />
                Delete
              </button>

              <button
                className="action-button-with-icon"
                disabled={saved}
                onClick={() => saveDraft()}
              >
                <SaveIcon />
                Save
              </button>

              <button
                className="action-button-with-icon"
                onClick={async () => {
                  if (!saved) await saveDraft();
                  navigate(`/draft/${draft.form?.id}`);
                }}
              >
                <ArrowRightIcon />{" "}
                <p>
                  <span
                    style={{
                      ...(saved && {
                        color: "grey",
                      }),
                    }}
                  >
                    Save &
                  </span>{" "}
                  Go to form
                </p>
              </button>

              <button
                className="action-button-with-icon green"
                onClick={() => handlePublishForm()}
              >
                <ShareIcon />
                Publish
              </button>
            </div>
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

  useEffect(() => {
    getPrivacyOptions(1);
    createNewDraft();
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
        setAutoSaveCountdown(5);
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
        draft.form.description !== prevSavedForm.form.description ||
        selectedPrivacyOption?.id !== draft.form.privacy_id ||
        privacyPasskey !== draft.form.passkey;
      setSaved(!condition);
      setNeedsAutoSave(condition);
    }
  }, [
    draft.form?.description,
    draft.form?.title,
    prevSavedForm.form?.description,
    prevSavedForm.form?.title,
    selectedPrivacyOption?.id,
    privacyPasskey,
    draft.form,
    prevSavedForm.form,
  ]);

  return (
    <main className="create-form">
      <div className="container">
        {initiallyLoading ? <p>Loading...</p> : renderView()}
      </div>
    </main>
  );
};
