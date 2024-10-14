import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteDraftForm } from "../../../hooks/useDeleteDraftForm";
import { useGetDraftForm } from "../../../hooks/useGetDraftForm";
import { useGetPrivacyOptions } from "../../../hooks/useGetPrivacyOptions";
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
import ActionButtonWithIcon from "../../ui/ActionButtonWithIcon/ActionButtonWithIcon";
import AddedInputsList from "../../ui/AddedInputsList/AddedInputsList";
import CatchView from "../../ui/CatchView/CatchView";
import { DeleteModal } from "../../ui/DeleteModal/DeleteModal";
import { DraftPublishedTag } from "../../ui/DraftPublishedTag/DraftPublishedTag";
import { ArrowLeftIcon } from "../../ui/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../../ui/icons/ArrowRightIcon";
import { SaveIcon } from "../../ui/icons/SaveIcon";
import { ShareIcon } from "../../ui/icons/ShareIcon";
import { TrashIcon } from "../../ui/icons/TrashIcon";
import { InputTypeSelector } from "../../ui/InputTypeSelector/InputTypeSelector";
import { MetadataInputs } from "../../ui/MetadataInputs/MetadataInputs";
import PrivacyOptions from "../../ui/PrivacyOptions/PrivacyOptions";
import SavedStatus from "../../ui/SavedStatus/SavedStatus";
import SelectedPrivacyOptionButton from "../../ui/SelectedPrivacyOptionButton/SelectedPrivacyOptionButton";
import { StagedInputForm } from "../../ui/StagedInputForm/StagedInputForm";
import "./EditDraftForm.css";

export const EditDraftForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const { setError } = useContext(ErrorContext);
  const { deleteDraftForm } = useDeleteDraftForm();
  const { getDraftForm } = useGetDraftForm();
  const { publish } = usePublish();
  const { updateDraftForm } = useUpdateDraftForm();

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

  const [saved, setSaved] = useState(true);

  const [form, setForm] = useState<DraftFormType | null>(null);
  const [inputs, setInputs] = useState<InputType[]>([]);
  const [prevSavedForm, setPrevSavedForm] = useState<DraftFormType | null>(null);
  const [prevSavedInputs, setPrevSavedInputs] = useState<InputType[]>([]);

  const { currentView, setCurrentView } = useContext(CurrentViewContext);
  const [stagedNewInputType, setStagedNewInputType] = useState<InputTypeType | null>(
    null
  );
  const [DeleteModalShowing, setDeleteModalShowing] = useState<boolean>(false);

  async function saveDraft(): Promise<void> {
    try {
      const data = await updateDraftForm({
        formId: form!.id,
        title: form!.title,
        description: form!.description,
        privacyId: stagedPrivacyOptions.find((privacyOption) => privacyOption.checked)!
          .id,
        privacyPasskey,
      });

      setPrevSavedInputs(inputs);

      setPrevSavedForm(data);

      setForm(data);

      setSaved(true);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handlePublishForm() {
    try {
      const data = await publish({
        draftFormId: form!.id,
      });

      navigate(`/form/${data[0].id}`);
    } catch (error) {
      handleCatchError(error, setError, null);
    }
  }

  async function handleFormDelete() {
    try {
      if (!form!.id) throw new Error("No form id provided");

      await deleteDraftForm({ formId: form!.id });

      navigate("/form-deleted");
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

  function renderView() {
    switch (currentView) {
      case "metadata-inputs": {
        return (
          <>
            <SavedStatus saved={saved} />
            <MetadataInputs form={form} setForm={setForm} />
            <AddedInputsList inputs={inputs} setInputs={setInputs} isForDraft={true} />
            {selectedPrivacyOption ? (
              <SelectedPrivacyOptionButton
                handleClick={() => setCurrentView("privacy-selector")}
                selectedPrivacyOption={selectedPrivacyOption}
              />
            ) : (
              false
            )}
            <div className="form-buttons">
              <ActionButtonWithIcon
                label="Delete Draft"
                disabled={false}
                color="red"
                icon={<TrashIcon />}
                iconPlacement="before"
                handleClick={(e) => {
                  e.stopPropagation();
                  setDeleteModalShowing(true);
                }}
              />

              <ActionButtonWithIcon
                label="Save Draft"
                disabled={false}
                color="none"
                icon={<SaveIcon />}
                iconPlacement="before"
                handleClick={() => saveDraft()}
              />

              <ActionButtonWithIcon
                label="Publish Form"
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
      case "privacy-selector": {
        return (
          <>
            <ActionButtonWithIcon
              label="Back"
              disabled={
                (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "") ||
                false
              }
              icon={<ArrowLeftIcon />}
              iconPlacement="before"
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
              icon={<ArrowRightIcon />}
              iconPlacement="after"
              handleClick={() => {
                if (stagedSelectedPrivacyOption?.needs_passkey && privacyPasskey === "")
                  return;
                console.log({ stagedPrivacyOptions });
                setPrivacyOptions(stagedPrivacyOptions);
                setReflectFormPrivacyOption(false);
                setCurrentView("metadata-inputs");
              }}
              color="none"
            />
          </>
        );
      }
      case "input-types-selector": {
        return <InputTypeSelector setStagedNewInputType={setStagedNewInputType} />;
      }
      case "staged-input-form": {
        return (
          <StagedInputForm
            formId={form.id}
            inputs={inputs}
            setInputs={setInputs}
            stagedNewInputType={stagedNewInputType}
            setStagedNewInputType={setStagedNewInputType}
            isForDraft={true}
          />
        );
      }
      default: {
        return <CatchView />;
      }
    }
  }

  useEffect(() => {
    async function fetchFormForEdit() {
      try {
        const data = await getDraftForm({ formId });

        setPrevSavedForm(data.form);
        setPrevSavedInputs(data.inputs);

        setForm(data.form);
        setInputs(data.inputs);

        getPrivacyOptions(data.form.privacy_id);
        setPrivacyPasskey(data.form.passkey);
      } catch (error) {
        handleCatchError(error, setError, null);
      }
    }

    fetchFormForEdit();
  }, []);

  useEffect(() => {
    if (form && prevSavedForm) {
      const condition =
        form.title !== prevSavedForm.title ||
        form.description !== prevSavedForm.description ||
        selectedPrivacyOption?.id !== form.privacy_id ||
        privacyPasskey !== form.passkey;

      setSaved(!condition);
    }
  }, [
    form?.description,
    form?.title,
    prevSavedForm?.description,
    prevSavedForm?.title,
    selectedPrivacyOption?.id,
    privacyPasskey,
  ]);

  useEffect(() => {
    if (reflectFormPrivacyOption)
      setStagedPrivacyOptions(
        privacyOptions.map((privacyOption) => ({
          ...privacyOption,
          checked: privacyOption.id === form?.privacy_id,
        }))
      );
  }, [privacyOptions, form, reflectFormPrivacyOption]);

  return (
    <main className="edit-draft-form">
      <div className="container">
        <DraftPublishedTag draftOrPublished="draft" />
        {renderView()}
        {DeleteModalShowing ? (
          <DeleteModal
            label="Delete draft?"
            handleDeleteClick={() => handleFormDelete()}
            setDeleteModalShowing={setDeleteModalShowing}
          />
        ) : (
          false
        )}
      </div>
    </main>
  );
};
