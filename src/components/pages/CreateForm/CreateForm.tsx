import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
import { useNewDraft } from "../../../hooks/useNewDraft";
import { usePublish } from "../../../hooks/usePublish";
import { useUpdateDraftForm } from "../../../hooks/useUpdateDraftForm";
import {
  DraftFormType,
  InputType,
  InputTypeType,
  PrivacyOptionType,
} from "../../../lib/types";
import { CurrentViewContext } from "../../../providers/CurrentViewProvider";
import { ErrorContext } from "../../../providers/ErrorContextProvider";
import { handleCatchError } from "../../../utils/usefulFunctions";
import { ActionButtonWithIcon } from "../../ui/ActionButtonWithIcon/ActionButtonWithIcon";
import { AddedInputsList } from "../../ui/AddedInputsList/AddedInputsList";
import { CatchView } from "../../ui/CatchView/CatchView";
import { FormHeader } from "../../ui/FormHeader/FormHeader";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { ShareIcon } from "../../ui/icons/ShareIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import { PrivacyOptions } from "../../ui/PrivacyOptions/PrivacyOptions";
import { SavedStatus } from "../../ui/SavedStatus/SavedStatus";
import { SelectedPrivacyOptionButton } from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { SingleSelectToggle } from "../../ui/SingleSelectToggle/SingleSelectToggle";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./CreateForm.css";
import { useGetInputTypes } from "../../../hooks/useGetInputTypes";

export function CreateForm() {
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { publish } = usePublish();
  const { updateDraftForm } = useUpdateDraftForm();
  const { inputTypes, loading: inputTypesLoading } = useGetInputTypes();
  const { newDraft, loading: initiallyLoading } = useNewDraft();
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

  // const [draft, setDraft] = useState<{
  //   form: DraftFormType | null;
  //   inputs: InputType[];
  // }>({
  //   form: null,
  //   inputs: [],
  // });

  // const [prevSavedDraft, setPrevSavedForm] = useState<{
  //   form: DraftFormType | null;
  //   inputs: InputType[];
  // }>({
  //   form: null,
  //   inputs: [],
  // });

  const [form, setForm] = useState<DraftFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [prevSavedForm, setPrevSavedForm] = useState<DraftFormType | null>(null);
  const [prevSavedInputs, setPrevSavedInputs] = useState<InputType[]>([]);

  const { currentView, setCurrentView } = useContext(CurrentViewContext);
  const [saved, setSaved] = useState(true);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(5);
  const [needsAutoSave, setNeedsAutoSave] = useState(false);
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [canResubmit, setCanResubmit] = useState(false);

  useEffect(() => {
    if (reflectFormPrivacyOption && !form) console.warn("no form here");
    if (reflectFormPrivacyOption && form)
      setStagedPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === form.privacy_id,
        }))
      );
  }, [privacyOptions, form, reflectFormPrivacyOption]);

  async function saveDraft() {
    try {
      console.log("saving draft");
      return;
      const data = await updateDraftForm({
        formId: form!.id,
        title: form!.title,
        description: form!.description,
        privacyId: stagedPrivacyOptions.find((privacyOption) => privacyOption.checked)
          ?.id,
        privacyPasskey,
        canResubmit,
      });

      setPrevSavedForm(data);
      setPrevSavedInputs(inputs);

      setForm(data);

      setSaved(true);
      setAutoSaveCountdown(5);
      setNeedsAutoSave(false);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  const stagedSelectedPrivacyOption = stagedPrivacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

  const selectedPrivacyOption = privacyOptions.find(
    (privacyOption) => privacyOption.checked
  );

  async function handlePublishForm() {
    try {
      if (!form) throw new Error("No draft form found when trying to delete");

      console.log(form);

      if (!form.id) throw new Error("No form id provided");

      const data = await publish({
        draftFormId: form.id,
      });

      if (!data) throw new Error("No form was found after publishing");

      console.log("data from publish", data);

      navigate(`/form/${data.id}`);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  function renderView() {
    switch (currentView) {
      case "privacy-selector": {
        return (
          <>
            <ActionButtonWithIcon
              label="Back"
              disabled={false}
              handleClick={() => {
                if (
                  stagedSelectedPrivacyOption?.needs_passkey &&
                  privacyPasskey !== "" &&
                  !selectedPrivacyOption?.needs_passkey
                )
                  setPrivacyPasskey("");
                setStagedPrivacyOptions(privacyOptions);
                setCurrentView("metadata-inputs");
              }}
              iconPlacement="before"
              icon={<ArrowLeftIcon />}
              color="none"
            />
            
            <PrivacyOptions
              privacyOptions={stagedPrivacyOptions}
              setPrivacyOptions={setStagedPrivacyOptions}
              loading={privacyOptionsLoading}
              error={privacyOptionsError}
              setPrivacyPasskey={setPrivacyPasskey}
              privacyPasskey={privacyPasskey}
            />

            <ActionButtonWithIcon
              label="Confirm & Continue"
              disabled={
                (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "") ||
                false
              }
              handleClick={() => {
                if (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "")
                  return;
                setPrivacyOptions(stagedPrivacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
              iconPlacement="before"
              icon={<ArrowRightIcon />}
              color="green-icon"
            />
          </>
        );
      }
      case "metadata-inputs": {
        return (
          <>
            <SavedStatus saved={saved} autoSaveCountdown={autoSaveCountdown} />

            <MetadataInputs form={form} setForm={setForm} />
            <p className='small-text'>Image input here?</p>
            <AddedInputsList inputs={inputs} setInputs={inputs} isForDraft={true} />
            {selectedPrivacyOption ? (
              <SelectedPrivacyOptionButton
                handleClick={() => setCurrentView("privacy-selector")}
                selectedPrivacyOption={selectedPrivacyOption}
              />
            ) : (
              false
            )}

            <SingleSelectToggle
              label="Users can re-submit their answers:"
              options={[
                { label: "Yes", value: true, checkedCondition: canResubmit },
                { label: "No", value: false, checkedCondition: !canResubmit },
              ]}
              onChange={(value) => setCanResubmit(value as boolean)}
            />

            <div className="form-buttons">
              <ActionButtonWithIcon
                label="Save"
                icon={<SaveIcon />}
                iconPlacement="before"
                disabled={saved}
                handleClick={() => saveDraft()}
                color="none"
              />

              <ActionButtonWithIcon
                label={`${!saved ? "Save & " : ""}Go to form`}
                handleClick={async () => {
                  if (!saved) await saveDraft();
                  navigate(`/draft/${form?.id}`);
                }}
                icon={<ArrowRightIcon />}
                iconPlacement="before"
                disabled={false}
                color="none"
              />

              <ActionButtonWithIcon
                label="Publish"
                disabled={false}
                color="green"
                icon={<ShareIcon />}
                iconPlacement="before"
                handleClick={() => handlePublishForm()}
              />
            </div>
          </>
        );
      }
      case "input-types-selector": {
        return (
          <InputTypeSelector
            inputTypes={inputTypes}
            setStagedNewInputType={setStagedNewInputType}
            loading={inputTypesLoading}
          />
        );
      }
      case "staged-input-form": {
        return (
          <>
            <StagedInputForm
              formId={form.id}
              inputs={inputs}
              setInputs={setInputs}
              stagedNewInputType={stagedNewInputType}
              setStagedNewInputType={setStagedNewInputType}
              isForDraft={true}
            />
          </>
        );
      }
      default: {
        return <CatchView />;
      }
    }
  }

  useEffect(() => {
    setPrevSavedForm(newDraft);
    setForm(newDraft);
  }, [newDraft]);

  useEffect(() => {
    getPrivacyOptions(1);
  }, []);

  useEffect(() => {
    async function autoSaveDraft(): Promise<void> {
      try {
        setPrevSavedForm(form);
        setPrevSavedInputs(inputs);

        saveDraft();

        setSaved(true);
        setNeedsAutoSave(false);
        setAutoSaveCountdown(5);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }
    const interval1 = setInterval(() => {
      if (needsAutoSave && form) {
        autoSaveDraft();
      }
    }, autoSaveCountdown * 1000);

    return () => {
      clearInterval(interval1);
    };
  }, [
    needsAutoSave,
    autoSaveCountdown,
    form?.description,
    form?.title,
    form,
    inputs,
    saveDraft,
    setError,
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
    if (form && prevSavedForm) {
      const condition =
        form.title !== prevSavedForm.title ||
        form.description !== prevSavedForm.description ||
        selectedPrivacyOption?.id !== form.privacy_id ||
        privacyPasskey !== form.passkey;
      console.log("new cond.", {
        raw: {
          1: [form.title, prevSavedForm.title],
          2: [form.description, prevSavedForm.description],
          3: [selectedPrivacyOption?.id, form.privacy_id],
          4: [privacyPasskey, form.passkey],
        },
        saved: !condition,
        needsAutoSave: condition,
        actual: condition,
      });
      setSaved(!condition);
      setNeedsAutoSave(condition);
    }
  }, [
    form?.description,
    form?.title,
    prevSavedForm?.description,
    prevSavedForm?.title,
    selectedPrivacyOption?.id,
    privacyPasskey,
    form,
    prevSavedForm,
  ]);

  return (
    <main className="create-form">
      <div className="container">
        {initiallyLoading ? <p>Loading...</p> : renderView()}
      </div>
    </main>
  );
}
